const eventList = document.querySelector('#event-list');
const upcomingEvents = document.querySelector('#upcoming-events');
const eventModal = document.querySelector('#event-modal');
const modalTitle = document.querySelector('#modal-title');
const modalContent = document.querySelector('#modal-content');

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderEvent(event, index) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'event-item event-item-button';
  item.innerHTML = `
    <div class="event-date">${escapeHtml(formatDate(event.date))}</div>
    <div class="event-main">
      <h3>${escapeHtml(event.title)}</h3>
      <div class="event-meta">${escapeHtml(event.city)} · ${escapeHtml(event.venue)}${event.time ? ` · ${escapeHtml(event.time)}` : ''}</div>
    </div>
    <div class="event-status">${escapeHtml(event.status || '未設定')}</div>
    <span class="event-arrow" aria-hidden="true">→</span>
  `;
  item.addEventListener('click', () => openEvent(event, index));
  return item;
}

function openEvent(event, index) {
  if (!eventModal || !modalTitle || !modalContent) return;

  modalTitle.textContent = event.title || '演出詳細資料';
  const fields = [
    ['演出日期', event.date ? formatDate(event.date) : '未設定'],
    ['演出時間', event.time || '未設定'],
    ['演出所在城市', event.city || '未設定'],
    ['演出詳細地點', event.venue || '未設定'],
    ['參與狀態（GO？）', event.status || '未設定']
  ];

  modalContent.innerHTML = fields.map(([label, value]) => `
    <div class="detail-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join('');

  const note = document.createElement('p');
  note.className = 'detail-note';
  note.textContent = `目前為演出資料第 ${index + 1} 筆。後續會在這裡加入活動來源、歌單、照片與其他關聯資料。`;
  modalContent.appendChild(note);

  eventModal.classList.add('is-open');
  eventModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  if (!eventModal) return;
  eventModal.classList.remove('is-open');
  eventModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-close-modal]').forEach(element => {
  element.addEventListener('click', closeModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

async function loadEvents() {
  if (!eventList) return;

  try {
    const response = await fetch('data/events.json');
    if (!response.ok) throw new Error('無法讀取演出資料');

    const events = await response.json();
    events.sort((a, b) => a.date.localeCompare(b.date));

    eventList.innerHTML = '';
    if (upcomingEvents) upcomingEvents.innerHTML = '';

    if (!events.length) {
      eventList.innerHTML = '<p>目前沒有可顯示的演出資料。</p>';
      if (upcomingEvents) upcomingEvents.innerHTML = '<p class="event-meta">資料尚未設定。</p>';
      return;
    }

    events.forEach((event, index) => {
      eventList.appendChild(renderEvent(event, index));
    });

    if (upcomingEvents) {
      events.slice(0, 3).forEach((event, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'upcoming-item';
        item.innerHTML = `<strong>${escapeHtml(formatDate(event.date))}</strong><span>${escapeHtml(event.title)}</span>`;
        item.addEventListener('click', () => openEvent(event, index));
        upcomingEvents.appendChild(item);
      });
    }
  } catch (error) {
    eventList.innerHTML = '<p>目前沒有可顯示的演出資料。</p>';
    if (upcomingEvents) upcomingEvents.innerHTML = '<p class="event-meta">資料尚未設定。</p>';
    console.error(error);
  }
}

loadEvents();

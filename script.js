const eventList = document.querySelector('#event-list');
const eventModal = document.querySelector('#event-modal');
const modalTitle = document.querySelector('#modal-title');
const modalContent = document.querySelector('#modal-content');
const logoImage = document.querySelector('.brand-logo-image');
const logoPlaceholder = document.querySelector('.brand-logo-placeholder');

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '日期未設定';

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function formatTime(timeString) {
  if (!timeString) return '未設定';
  return timeString;
}

function cleanCity(city) {
  return String(city || '').replace(/^.*?\|\s*/, '').trim() || '未設定';
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
      <h3>${escapeHtml(event.title || '未命名演出')}</h3>
      <div class="event-meta">${escapeHtml(cleanCity(event.city))} · ${escapeHtml(event.venue || '地點未設定')}${event.time ? ` · ${escapeHtml(event.time)}` : ''}</div>
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
    ['演出時間', formatTime(event.time)],
    ['演出所在城市', cleanCity(event.city)],
    ['演出詳細地點', event.venue || '未設定'],
    ['演出類型', event.type || '未設定'],
    ['參與狀態（GO？）', event.status || '未設定']
  ];

  modalContent.innerHTML = fields.map(([label, value]) => `
    <div class="detail-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join('');

  if (event.source) {
    const source = document.createElement('a');
    source.className = 'detail-note text-link';
    source.href = event.source;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = '開啟演出來源 →';
    modalContent.appendChild(source);
  }

  if (event.notion_url) {
    const notion = document.createElement('a');
    notion.className = 'detail-note text-link';
    notion.href = event.notion_url;
    notion.target = '_blank';
    notion.rel = 'noopener noreferrer';
    notion.textContent = '開啟 Notion 原始資料 →';
    modalContent.appendChild(notion);
  }

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

function renderEvents(events) {
  if (!eventList) return;

  const sortedEvents = [...events].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  eventList.innerHTML = '';

  if (!sortedEvents.length) {
    eventList.innerHTML = '<p>目前沒有可顯示的演出資料。</p>';
    return;
  }

  sortedEvents.forEach((event, index) => {
    eventList.appendChild(renderEvent(event, index));
  });
}

async function loadEvents() {
  if (!eventList) return;

  try {
    const dataUrl = new URL('Data/events.json', document.baseURI).href;
    const response = await fetch(`${dataUrl}?v=4`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`演出資料載入失敗：HTTP ${response.status}`);

    const events = await response.json();
    if (!Array.isArray(events)) throw new Error('演出資料格式不是陣列');

    renderEvents(events);
  } catch (error) {
    console.error(error);
    eventList.innerHTML = `<p>演出資料暫時無法載入。請稍後重新整理頁面。</p>`;
  }
}

function setupLogo() {
  if (!logoImage || !logoPlaceholder) return;

  logoImage.addEventListener('load', () => {
    logoImage.classList.add('is-loaded');
    logoPlaceholder.classList.add('is-hidden');
  });

  logoImage.addEventListener('error', () => {
    logoImage.classList.remove('is-loaded');
    logoPlaceholder.classList.remove('is-hidden');
  });
}

setupLogo();
loadEvents();

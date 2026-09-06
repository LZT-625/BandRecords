const eventList = document.querySelector('#event-list');
const upcomingEvents = document.querySelector('#upcoming-events');
const rankingList = document.querySelector('#ranking-list');
const eventModal = document.querySelector('#event-modal');
const modalTitle = document.querySelector('#modal-title');
const modalContent = document.querySelector('#modal-content');
const logoImage = document.querySelector('.brand-logo-image');
const logoFallback = document.querySelector('.brand-logo-fallback');

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '日期未設定';

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function formatEventDateTime(event) {
  const dateText = event.date ? formatDate(event.date) : '日期未設定';

  if (event.end_date && event.end_date !== event.date) {
    const endDateText = formatDate(event.end_date).replace(/^\d{4}\//, '');
    return `${dateText}–${endDateText}`;
  }

  if (event.is_datetime && event.time) {
    return event.end_time ? `${dateText} ${event.time}–${event.end_time}` : `${dateText} ${event.time}`;
  }

  return dateText;
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

function buildGoogleMapsUrl(address) {
  const value = String(address || '').trim();
  if (!value) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
}

function renderSongList(songs) {
  const list = Array.isArray(songs)
    ? songs.filter(song => song && song.title).slice(0, 20)
    : [];

  if (!list.length) {
    return '<p class="detail-empty">目前沒有歌單資料。</p>';
  }

  return `
    <ol class="song-list">
      ${list.map((song, index) => {
        const title = escapeHtml(song.title);
        const link = String(song.url || '').trim();
        return link
          ? `<li><a class="song-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer"><span>${index + 1}.</span>${title}</a></li>`
          : `<li><span class="song-link song-link--plain"><span>${index + 1}.</span>${title}</span></li>`;
      }).join('')}
    </ol>
  `;
}

function renderEvent(event) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'event-item event-item-button';
  item.innerHTML = `
    <div class="event-date">${escapeHtml(event.date ? formatDate(event.date) : '日期未設定')}</div>
    <div class="event-main">
      <h3>${escapeHtml(event.title || '未命名演出')}</h3>
      <div class="event-meta">${escapeHtml(cleanCity(event.city))} · ${escapeHtml(event.venue || '地點未設定')}${event.is_datetime && event.time ? ` · ${escapeHtml(event.time)}` : ''}</div>
    </div>
    <div class="event-status">${escapeHtml(event.status || '未設定')}</div>
    <span class="event-arrow" aria-hidden="true">→</span>
  `;
  item.addEventListener('click', () => openEvent(event));
  return item;
}

function openEvent(event) {
  if (!eventModal || !modalTitle || !modalContent) return;

  modalTitle.textContent = event.title || '演出詳細資料';

  const mapsUrl = buildGoogleMapsUrl(event.address);
  const sourceUrl = String(event.source || '').trim();

  modalContent.innerHTML = `
    <div class="detail-summary">
      <div class="detail-summary-item">
        <span>演出時間</span>
        <strong>${escapeHtml(formatEventDateTime(event))}</strong>
      </div>
      <div class="detail-summary-item">
        <span>演出類型</span>
        <strong>${escapeHtml(event.type || '未設定')}</strong>
      </div>
      <div class="detail-summary-item">
        <span>所在城市</span>
        <strong>${escapeHtml(cleanCity(event.city))}</strong>
      </div>
    </div>

    <section class="detail-section detail-section--songs">
      <h3>今日歌單</h3>
      ${renderSongList(event.songs)}
    </section>

    <section class="detail-section">
      <h3>演出詳細地址</h3>
      <p class="detail-value">${escapeHtml(event.address || '目前尚未設定詳細地址')}</p>
      ${mapsUrl ? `<a class="text-link detail-link" href="${escapeHtml(mapsUrl)}" target="_blank" rel="noopener noreferrer">在 Google Maps 開啟 →</a>` : '<p class="detail-empty">目前沒有可使用的地圖連結。</p>'}
    </section>

    <section class="detail-section detail-section--source">
      <h3>演出資訊來源</h3>
      ${sourceUrl ? `<a class="text-link detail-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">開啟演出詳細資訊 →</a>` : '<p class="detail-empty">目前沒有設定來源網址。</p>'}
    </section>
  `;

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

  sortedEvents.forEach(event => {
    eventList.appendChild(renderEvent(event));
  });
}

function renderUpcomingEvents(events) {
  if (!upcomingEvents) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextEvents = [...events]
    .filter(event => {
      const date = new Date(`${event.date}T00:00:00`);
      return !Number.isNaN(date.getTime()) && date >= today;
    })
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(0, 3);

  if (!nextEvents.length) {
    upcomingEvents.innerHTML = '<p class="section-empty">目前沒有即將到來的演出。</p>';
    return;
  }

  upcomingEvents.innerHTML = nextEvents.map((event, index) => `
    <article class="upcoming-event-card" data-event-index="${index}">
      <div>
        <div class="upcoming-event-date">${escapeHtml(formatEventDateTime(event))}</div>
        <h3>${escapeHtml(event.title || '未命名演出')}</h3>
        <div class="upcoming-event-meta">
          <span>${escapeHtml(cleanCity(event.city))}</span>
          <span>${escapeHtml(event.venue || '地點未設定')}</span>
          <span>${escapeHtml(event.type || '演出')}</span>
        </div>
      </div>
      <div>
        <span class="upcoming-event-status">${escapeHtml(event.status || '未設定')}</span>
      </div>
    </article>
  `).join('');

  upcomingEvents.querySelectorAll('[data-event-index]').forEach((card, index) => {
    card.addEventListener('click', () => openEvent(nextEvents[index]));
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openEvent(nextEvents[index]);
      }
    });
  });
}

function renderSongRanking(events) {
  if (!rankingList) return;

  const songfulEvents = events.filter(event => Array.isArray(event.songs) && event.songs.length);
  const counts = new Map();

  songfulEvents.forEach(event => {
    const seenInEvent = new Set();
    event.songs.forEach(song => {
      if (!song || !song.title || seenInEvent.has(song.title)) return;
      seenInEvent.add(song.title);
      counts.set(song.title, (counts.get(song.title) || 0) + 1);
    });
  });

  if (!songfulEvents.length || !counts.size) {
    rankingList.innerHTML = '<p class="section-empty">目前沒有足夠的歌單資料可計算。</p>';
    return;
  }

  const ranking = [...counts.entries()]
    .map(([title, count]) => ({ title, count, percent: (count / songfulEvents.length) * 100 }))
    .sort((a, b) => b.percent - a.percent || a.title.localeCompare(b.title, 'zh-Hant'));

  rankingList.innerHTML = ranking.map((song, index) => `
    <div class="ranking-item">
      <span class="ranking-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="ranking-title">${escapeHtml(song.title)}</span>
      <span class="ranking-percent">${song.percent.toFixed(0)}%</span>
      <div class="ranking-bar" aria-hidden="true">
        <div class="ranking-fill" style="width: ${song.percent.toFixed(2)}%"></div>
      </div>
    </div>
  `).join('');
}

async function loadEvents() {
  try {
    const dataUrl = new URL('Data/events.json', document.baseURI).href;
    const response = await fetch(`${dataUrl}?v=7`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`演出資料載入失敗：HTTP ${response.status}`);

    const events = await response.json();
    if (!Array.isArray(events)) throw new Error('演出資料格式不是陣列');

    renderEvents(events);
    renderUpcomingEvents(events);
    renderSongRanking(events);
  } catch (error) {
    console.error(error);
    const message = '<p>演出資料暫時無法載入。請稍後重新整理頁面。</p>';
    if (eventList) eventList.innerHTML = message;
    if (upcomingEvents) upcomingEvents.innerHTML = message;
    if (rankingList) rankingList.innerHTML = message;
  }
}

function setupLogo() {
  if (!logoImage || !logoFallback) return;

  const showFallback = () => {
    logoImage.hidden = true;
    logoFallback.hidden = false;
  };

  logoFallback.hidden = true;
  logoImage.hidden = false;
  logoImage.addEventListener('error', showFallback);
  logoImage.addEventListener('load', () => {
    logoImage.hidden = false;
    logoFallback.hidden = true;
  });

  if (logoImage.complete && logoImage.naturalWidth === 0) {
    showFallback();
  }
}

setupLogo();
loadEvents();

const eventList = document.querySelector('#event-list');
const upcomingEvents = document.querySelector('#upcoming-events');

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function renderEvent(event) {
  const item = document.createElement('article');
  item.className = 'event-item';
  item.innerHTML = `
    <div class="event-date">${formatDate(event.date)}</div>
    <div>
      <h3>${event.title}</h3>
      <div class="event-meta">${event.city} · ${event.venue}${event.time ? ` · ${event.time}` : ''}</div>
    </div>
    <div class="event-status">${event.status || '未設定'}</div>
  `;
  return item;
}

async function loadEvents() {
  try {
    const response = await fetch('data/events.json');
    if (!response.ok) throw new Error('無法讀取演出資料');

    const events = await response.json();
    events.sort((a, b) => a.date.localeCompare(b.date));

    events.forEach(event => eventList.appendChild(renderEvent(event)));
    events.slice(0, 3).forEach(event => {
      const item = document.createElement('div');
      item.className = 'event-meta';
      item.style.marginBottom = '12px';
      item.innerHTML = `<strong>${formatDate(event.date)}</strong>　${event.title}`;
      upcomingEvents.appendChild(item);
    });
  } catch (error) {
    eventList.innerHTML = '<p>目前沒有可顯示的演出資料。</p>';
    upcomingEvents.innerHTML = '<p class="event-meta">資料尚未設定。</p>';
    console.error(error);
  }
}

loadEvents();

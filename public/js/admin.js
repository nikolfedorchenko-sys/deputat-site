'use strict';
/* Адмінпанель: керування контентом через fetch до /api/admin/*. */

// ─────────────── Хелпери ───────────────
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function toast(text, isError = false) {
  const el = $('#toast');
  el.textContent = text;
  el.className = 'toast show' + (isError ? ' err' : '');
  setTimeout(() => (el.className = 'toast'), 2600);
}

// JSON-запит
async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { location.href = '/manager/login'; throw new Error('401'); }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Помилка запиту');
  return json;
}
// Запит із файлами (FormData)
async function apiForm(method, url, formData) {
  const res = await fetch(url, { method, body: formData });
  if (res.status === 401) { location.href = '/manager/login'; throw new Error('401'); }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Помилка запиту');
  return json;
}
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ─────────────── Вкладки ───────────────
$('#tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  $$('.tab').forEach((t) => t.classList.toggle('is-active', t === btn));
  const name = btn.dataset.tab;
  $$('.panel').forEach((p) => p.classList.toggle('is-active', p.dataset.panel === name));
});

// ═══════════════ НОВИНИ ═══════════════
const newsDialog = $('#newsDialog');
const newsForm = $('#newsForm');

async function loadNews() {
  const list = await api('GET', '/api/admin/news');
  const box = $('#newsList');
  box.innerHTML = list.length ? '' : '<p class="hint">Новин ще немає.</p>';
  list.forEach((n) => {
    const el = document.createElement('div');
    el.className = 'list-item';
    el.innerHTML = `
      <img src="${n.cover_image || '/img/hero-placeholder.svg'}" alt="" />
      <div class="list-item__main">
        <div class="list-item__title">${esc(n.title)}</div>
        <div class="list-item__meta">${n.date} ${n.tag ? '· ' + esc(n.tag) : ''}
          <span class="badge ${n.status === 'published' ? 'badge--pub' : 'badge--draft'}">
            ${n.status === 'published' ? 'Опубліковано' : 'Чернетка'}</span>
        </div>
      </div>
      <div class="list-item__actions">
        <button class="btn btn--sm" data-edit="${n.id}">Редагувати</button>
        <button class="btn btn--sm btn--danger" data-del="${n.id}">Видалити</button>
      </div>`;
    box.appendChild(el);
  });
}

$('#newsList').addEventListener('click', async (e) => {
  const edit = e.target.closest('[data-edit]');
  const del = e.target.closest('[data-del]');
  if (edit) return openNewsForm(Number(edit.dataset.edit));
  if (del) {
    if (!confirm('Видалити цю новину?')) return;
    try { await api('DELETE', `/api/admin/news/${del.dataset.del}`); toast('Новину видалено'); loadNews(); }
    catch (err) { toast(err.message, true); }
  }
});

$('#newsNewBtn').addEventListener('click', () => openNewsForm());

async function openNewsForm(id) {
  newsForm.reset();
  $('#newsCoverPreview').innerHTML = '';
  $('#newsImagesPreview').innerHTML = '';
  newsForm.id.value = '';
  if (id) {
    const n = await api('GET', `/api/admin/news/${id}`);
    $('#newsFormTitle').textContent = 'Редагувати новину';
    newsForm.id.value = n.id;
    newsForm.title.value = n.title;
    newsForm.date.value = n.date;
    newsForm.tag.value = n.tag || '';
    newsForm.body.value = n.body || '';
    newsForm.status.value = n.status;
    if (n.cover_image) {
      $('#newsCoverPreview').innerHTML =
        `<figure><img src="${n.cover_image}" alt=""></figure>`;
    }
    // Існуючі додаткові фото з кнопкою видалення
    (n.images || []).forEach((img) => {
      const fig = document.createElement('figure');
      fig.innerHTML = `<img src="${img.path}" alt=""><button type="button" title="Видалити">×</button>`;
      fig.querySelector('button').addEventListener('click', async () => {
        if (!confirm('Видалити це фото?')) return;
        try { await api('DELETE', `/api/admin/news/${n.id}/images/${img.id}`); fig.remove(); toast('Фото видалено'); }
        catch (err) { toast(err.message, true); }
      });
      $('#newsImagesPreview').appendChild(fig);
    });
  } else {
    $('#newsFormTitle').textContent = 'Нова новина';
    newsForm.date.value = new Date().toISOString().slice(0, 10);
  }
  newsDialog.showModal();
}

newsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = newsForm.id.value;
  const fd = new FormData(newsForm);
  fd.delete('id');
  try {
    if (id) await apiForm('PUT', `/api/admin/news/${id}`, fd);
    else await apiForm('POST', '/api/admin/news', fd);
    newsDialog.close();
    toast('Збережено');
    loadNews();
  } catch (err) { toast(err.message, true); }
});

// ═══════════════ ГАЛЕРЕЯ ═══════════════
async function loadGallery() {
  const items = await api('GET', '/api/admin/gallery');
  const grid = $('#galleryGrid');
  grid.innerHTML = items.length ? '' : '<p class="hint">Зображень ще немає.</p>';
  items.forEach((g) => {
    const card = document.createElement('div');
    card.className = 'g-card';
    card.draggable = true;
    card.dataset.id = g.id;
    card.innerHTML = `
      <img src="${g.path}" alt="">
      <div class="g-card__body">
        <input type="text" value="${esc(g.caption)}" placeholder="Підпис" maxlength="300">
        <button class="btn btn--sm btn--danger btn--block" data-del="${g.id}">Видалити</button>
      </div>`;
    // Збереження підпису при втраті фокуса
    card.querySelector('input').addEventListener('change', async (ev) => {
      try { await api('PUT', `/api/admin/gallery/${g.id}`, { caption: ev.target.value }); toast('Підпис збережено'); }
      catch (err) { toast(err.message, true); }
    });
    grid.appendChild(card);
  });
  enableDragReorder(grid, '.g-card', async (order) => {
    try { await api('PUT', '/api/admin/gallery/reorder', { order }); toast('Порядок збережено'); }
    catch (err) { toast(err.message, true); }
  });
}

$('#galleryGrid').addEventListener('click', async (e) => {
  const del = e.target.closest('[data-del]');
  if (!del) return;
  if (!confirm('Видалити зображення?')) return;
  try { await api('DELETE', `/api/admin/gallery/${del.dataset.del}`); toast('Видалено'); loadGallery(); }
  catch (err) { toast(err.message, true); }
});

$('#galleryUploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  if (!fd.getAll('images').some((f) => f && f.size)) return;
  try { await apiForm('POST', '/api/admin/gallery', fd); e.target.reset(); toast('Завантажено'); loadGallery(); }
  catch (err) { toast(err.message, true); }
});

// Перевпорядкування через drag&drop (спільна функція для галереї й досягнень)
function enableDragReorder(container, itemSel, onDrop) {
  let dragEl = null;
  container.addEventListener('dragstart', (e) => {
    dragEl = e.target.closest(itemSel);
    if (dragEl) dragEl.classList.add('dragging');
  });
  container.addEventListener('dragend', () => {
    if (!dragEl) return;
    dragEl.classList.remove('dragging');
    dragEl = null;
    const order = $$(itemSel, container).map((el) => el.dataset.id);
    onDrop(order);
  });
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!dragEl) return;
    const after = getDragAfter(container, itemSel, e.clientY, e.clientX);
    if (after == null) container.appendChild(dragEl);
    else container.insertBefore(dragEl, after);
  });
}
function getDragAfter(container, itemSel, y, x) {
  const els = $$(`${itemSel}:not(.dragging)`, container);
  let closest = { dist: -Infinity, el: null };
  els.forEach((el) => {
    const box = el.getBoundingClientRect();
    // порівнюємо по вертикалі, для сітки враховуємо і горизонталь
    const offset = y - box.top - box.height / 2 + (x - box.left - box.width / 2) * 0.001;
    if (offset < 0 && offset > closest.dist) closest = { dist: offset, el };
  });
  return closest.el;
}

// ═══════════════ ТЕКСТИ / КОНТАКТИ (settings) ═══════════════
let SETTINGS = {};
async function loadSettings() {
  SETTINGS = await api('GET', '/api/settings');
  // Заповнюємо всі поля з data-key у формах текстів і контактів
  $$('[data-key]').forEach((el) => { el.value = SETTINGS[el.dataset.key] ?? ''; });
  // Прев'ю медіа
  $('#heroPhotoPreview').src = SETTINGS.hero_photo || '/img/hero-placeholder.svg';
  $('#logoPreview').src = SETTINGS.logo || '/img/logo-placeholder.svg';
  $('#ogPreview').src = SETTINGS.og_image || '/img/hero-placeholder.svg';
}

async function saveSettingsForm(form) {
  const payload = {};
  $$('[data-key]', form).forEach((el) => { payload[el.dataset.key] = el.value; });
  await api('PUT', '/api/admin/settings', payload);
  Object.assign(SETTINGS, payload);
}

$('#textsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await saveSettingsForm(e.target); toast('Тексти збережено'); }
  catch (err) { toast(err.message, true); }
});
$('#contactsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await saveSettingsForm(e.target); toast('Контакти збережено'); }
  catch (err) { toast(err.message, true); }
});

// ═══════════════ МЕДІА (фото / логотип / og) ═══════════════
function bindMediaInput(inputId, previewId, key) {
  $(`#${inputId}`).addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { path } = await apiForm('POST', '/api/admin/upload', fd);
      await api('PUT', '/api/admin/settings', { [key]: path });
      $(`#${previewId}`).src = path;
      SETTINGS[key] = path;
      toast('Зображення оновлено');
    } catch (err) { toast(err.message, true); }
    e.target.value = '';
  });
}
bindMediaInput('heroPhotoInput', 'heroPhotoPreview', 'hero_photo');
bindMediaInput('logoInput', 'logoPreview', 'logo');
bindMediaInput('ogInput', 'ogPreview', 'og_image');

// ═══════════════ ДОСЯГНЕННЯ ═══════════════
const achDialog = $('#achDialog');
const achForm = $('#achForm');

async function loadAchievements() {
  const items = await api('GET', '/api/admin/achievements');
  const box = $('#achList');
  box.innerHTML = items.length ? '' : '<p class="hint">Карток ще немає.</p>';
  items.forEach((a) => {
    const el = document.createElement('div');
    el.className = 'ach-item';
    el.draggable = true;
    el.dataset.id = a.id;
    el.innerHTML = `
      <span class="drag-handle" title="Перетягнути">⋮⋮</span>
      <div class="ach-item__main">
        <div class="ach-item__title">${esc(a.title)}</div>
        <div class="ach-item__body">${esc(a.body)}</div>
      </div>
      <div class="list-item__actions">
        <button class="btn btn--sm" data-edit="${a.id}">✏️</button>
        <button class="btn btn--sm btn--danger" data-del="${a.id}">🗑️</button>
      </div>`;
    box.appendChild(el);
  });
  enableDragReorder(box, '.ach-item', async (order) => {
    try { await api('PUT', '/api/admin/achievements/reorder', { order }); toast('Порядок збережено'); }
    catch (err) { toast(err.message, true); }
  });
}

$('#achList').addEventListener('click', async (e) => {
  const edit = e.target.closest('[data-edit]');
  const del = e.target.closest('[data-del]');
  if (edit) {
    const items = await api('GET', '/api/admin/achievements');
    const a = items.find((x) => x.id === Number(edit.dataset.edit));
    if (!a) return;
    $('#achFormTitle').textContent = 'Редагувати картку';
    achForm.id.value = a.id;
    achForm.title.value = a.title;
    achForm.body.value = a.body;
    achDialog.showModal();
  }
  if (del) {
    if (!confirm('Видалити картку?')) return;
    try { await api('DELETE', `/api/admin/achievements/${del.dataset.del}`); toast('Видалено'); loadAchievements(); }
    catch (err) { toast(err.message, true); }
  }
});

$('#achNewBtn').addEventListener('click', () => {
  achForm.reset();
  achForm.id.value = '';
  $('#achFormTitle').textContent = 'Нова картка';
  achDialog.showModal();
});

achForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = achForm.id.value;
  const payload = { title: achForm.title.value, body: achForm.body.value };
  try {
    if (id) await api('PUT', `/api/admin/achievements/${id}`, payload);
    else await api('POST', '/api/admin/achievements', payload);
    achDialog.close();
    toast('Збережено');
    loadAchievements();
  } catch (err) { toast(err.message, true); }
});

// ═══════════════ ЗВЕРНЕННЯ ═══════════════
async function loadSubmissions() {
  const items = await api('GET', '/api/admin/submissions');
  const box = $('#subsList');
  box.innerHTML = items.length ? '' : '<p class="hint">Звернень ще немає.</p>';
  items.forEach((s) => {
    const el = document.createElement('div');
    el.className = 'sub' + (s.processed ? ' done' : '');
    el.innerHTML = `
      <div class="sub__head">
        <span class="sub__name">${esc(s.name)} · ${esc(s.contact)}${s.subject ? ' · ' + esc(s.subject) : ''}</span>
        <span>${s.created_at}</span>
      </div>
      <div class="sub__msg">${esc(s.message)}</div>
      <div class="sub__actions">
        <button class="btn btn--sm" data-toggle="${s.id}" data-processed="${s.processed}">
          ${s.processed ? '↺ Повернути в роботу' : '✓ Опрацьовано'}</button>
        <button class="btn btn--sm btn--danger" data-del="${s.id}">Видалити</button>
      </div>`;
    box.appendChild(el);
  });
}

$('#subsList').addEventListener('click', async (e) => {
  const toggle = e.target.closest('[data-toggle]');
  const del = e.target.closest('[data-del]');
  if (toggle) {
    const processed = toggle.dataset.processed === '1' ? 0 : 1;
    try { await api('PUT', `/api/admin/submissions/${toggle.dataset.toggle}`, { processed }); loadSubmissions(); }
    catch (err) { toast(err.message, true); }
  }
  if (del) {
    if (!confirm('Видалити звернення?')) return;
    try { await api('DELETE', `/api/admin/submissions/${del.dataset.del}`); toast('Видалено'); loadSubmissions(); }
    catch (err) { toast(err.message, true); }
  }
});

// Закриття діалогів кнопками «Скасувати»
$$('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));

// ─────────────── Старт ───────────────
(async function init() {
  try {
    await Promise.all([
      loadNews(), loadGallery(), loadSettings(),
      loadAchievements(), loadSubmissions(),
    ]);
  } catch (err) { toast(err.message, true); }
})();

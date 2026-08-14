(function () {
  const wrap = document.getElementById('sloganWrap');
  if (!wrap) return;

  // Уважаем настройку "меньше анимации" — показываем статичный золотой текст
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wrap.classList.add('podium-hero__slogan--static');
    return;
  }

  let manual = false;
  let mx = 50, my = 50;

  wrap.addEventListener('mousemove', function (e) {
    manual = true;
    const rect = wrap.getBoundingClientRect();
    mx = ((e.clientX - rect.left) / rect.width) * 100;
    my = ((e.clientY - rect.top) / rect.height) * 100;
  });
  wrap.addEventListener('mouseleave', function () {
    manual = false;
  });

  let t = 0;
  function tick() {
    let x, y;
    if (manual) {
      x = mx; y = my;
    } else {
      // Плавное самостоятельное движение "луча" по слогану
      t += 0.012;
      x = 50 + 46 * Math.sin(t);
      y = 50 + 18 * Math.sin(t * 1.7);
    }
    wrap.style.setProperty('--x', x + '%');
    wrap.style.setProperty('--y', y + '%');
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

(function () {
  // Список брендов-партнёров со ссылками на сайты.
  // Добавляй/убирай/переставляй строки { name: "...", url: "..." }
  const BRANDS = [
    { name: "Album", url: "https://album.it/it" },
    { name: "Artemide", url: "https://www.artemide.com/en/home" },
    { name: "Axolight", url: "https://www.axolight.it/" },
    { name: "Banci", url: "https://www.banci.it/" },
    { name: "Benito", url: "https://www.benito.com/" },
    { name: "Bover", url: "https://bover.es/es/" },
    { name: "Brand van Egmond", url: "https://brandvanegmond.com/" },
    { name: "Catellani&Smith", url: "https://www.catellanismith.com/" },
    { name: "Davide Groppi", url: "https://www.davidegroppi.com/en" },
    { name: "de Majo", url: "https://www.demajolight.com/" },
    { name: "Egoluce", url: "https://www.egoluce.com/" },
    { name: "Estiluz", url: "https://www.estiluz.com/en" },
    { name: "Erco", url: "https://www.erco.com/en/" },
    { name: "Fabbian", url: "https://www.fabbian.com/it" },
    { name: "Faustig", url: "https://www.faustig.de/ru/" },
    { name: "FLOS", url: "https://flos.com/en/pl/" },
    { name: "Fontini", url: "https://fontini.com/" },
    { name: "Foscarini", url: "https://www.foscarini.com/" },
    { name: "Gira", url: "https://www.gira.com/en/en/" },
    { name: "Gubi", url: "https://gubi.com/en/dk" },
    { name: "Iguzzini", url: "https://www.iguzzini.com/" },
    { name: "Ilfari", url: "https://www.ilfari.com/" },
    { name: "Jung", url: "https://www.jung.de/ru/" },
    { name: "Kreon", url: "https://www.kreon.com/en/catalogue" },
    { name: "Legrand", url: "https://www.legrand.com/en/landing" },
    { name: "LightGraphix", url: "https://www.lightgraphix.co.uk/" },
    { name: "Linealight", url: "https://www.linealight.com/en" },
    { name: "Luceplan", url: "https://www.luceplan.com/" },
    { name: "Lutron", url: "https://www.lutron.com/en-US/pages/default.aspx" },
    { name: "Mariner", url: "https://www.marinerluxury.com/en" },
    { name: "Marset", url: "https://www.marset.com/en/" },
    { name: "Meyer", url: "https://www.meyer-lighting.com/en/" },
    { name: "MLE", url: "https://www.mlelighting.com/" },
    { name: "Modular Lighting Instruments", url: "https://www.supermodular.com/en/" },
    { name: "Molto Luce", url: "https://www.moltoluce.com/en/" },
    { name: "Neri", url: "https://www.neri.biz/us/" },
    { name: "Objet Insolite", url: "https://www.objetinsolite.com/" },
    { name: "Ole", url: "https://www.ole-lighting.com/" },
    { name: "Pallucco", url: "https://www.pallucco.com/" },
    { name: "Patrizia Garganti", url: "https://www.patriziagarganti.com/" },
    { name: "Prolicht", url: "https://www.prolicht.at/" },
    { name: "Robers", url: "https://robers.com/" },
    { name: "Roger Pradier", url: "https://roger-pradier.com/" },
    { name: "RZB", url: "https://www.rzb.de/de/" },
    { name: "Schneider Electric", url: "https://www.se.com/il/en/" },
    { name: "Targetti", url: "https://www.targetti.com/en" },
    { name: "Tobias Grau", url: "https://www.grau.art/" },
    { name: "Tom Dixon", url: "https://www.tomdixon.net/en/" },
    { name: "Venini", url: "https://www.venini.com/it_it/" },
    { name: "Verpan", url: "https://verpan.com/collections/lighting" },
    { name: "Vertigo Bird", url: "https://www.vertigo-bird.com/" },
    { name: "Vibia", url: "https://vibia.com/" },
    { name: "Vistosi", url: "https://vistosi.it/" },
    { name: "Visual Comfort", url: "https://www.visualcomfort.com/" },
    { name: "Aledo", url: "https://aledo-pro.ru/" },
    { name: "Arlight", url: "https://arlight.ru/" },
    { name: "Радуга", url: "https://raduga-light.com/ru/" },
    { name: "Casambi", url: "https://casambi.tilda.ws/" },
    { name: "Maytoni", url: "https://maytoni.ru/" },
    { name: "Зенит", url: "https://zenit-stp.com/" }
  ];

  document.getElementById('brandsRow').innerHTML = BRANDS
    .concat(BRANDS)
    .map(b => `<span><a href="${b.url}" target="_blank" rel="noopener">${b.name}</a></span>`)
    .join('');
})();

(function () {
  /* =================================================================
     ИСТОЧНИК ДАННЫХ — витрина подгружает светильники из базы Supabase.
     Редактировать позиции нужно НЕ здесь в коде, а через админку:
     https://podium-rasprodazha-belykhveronika-5974s-projects.vercel.app/admin.html
     Ключ ниже (SUPABASE_ANON_KEY) — публичный ключ "только для чтения"
     с точки зрения сайта: по правилам доступа (RLS) на базе через него
     можно ЧИТАТЬ каталог, но нельзя ничего менять без входа в админку.
  ================================================================= */
  const SUPABASE_URL = "https://vjwnxbxtsglrvbxyhdza.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqd254Ynh0c2dscnZieHloZHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODc5ODgsImV4cCI6MjEwMjI2Mzk4OH0.LSrfwjY1f3PU13_W4WZlPfCmMNC9SUF91uMi1I5v0cU";

  // Телефон менеджера — показывается на каждой карточке и в модальном окне.
  const MANAGER_PHONE = "+7 (812) 702-64-80";

  const placeholderSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#f2efe7" stroke-width="1" opacity="0.5"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 6 6c0 3-2 4-2 7H8c0-3-2-4-2-7a6 6 0 0 1 6-6z"/></svg>`;
  const phoneIconSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.8-3.5-6-6l2-2-3-6-4 0z"/></svg>`;

  // Экранирование пользовательских данных перед вставкой в HTML —
  // защита от XSS, даже если в базу случайно попадёт "<script>" в тексте.
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPrice(n) {
    return Number(n).toLocaleString('ru-RU') + ' ₽';
  }

  function discountPercent(l) {
    if (!l.oldPrice) return 0;
    return Math.round((1 - l.price / l.oldPrice) * 100);
  }

  function phoneHref() {
    return `tel:${MANAGER_PHONE.replace(/[^\d+]/g, '')}`;
  }

  function renderCard(l, index) {
    const safeImage = l.image ? esc(l.image) : '';
    const bg = safeImage ? `style="background-image:url('${safeImage}')"` : '';
    const img = safeImage ? '' : placeholderSVG;
    const oldPriceHtml = l.oldPrice ? `<span class="lamp-card__old-price">${formatPrice(l.oldPrice)}</span>` : '';
    const discount = discountPercent(l);

    return `
      <div class="lamp-card" data-type="${esc(l.type || 'all')}" data-discount="${discount}" data-index="${index}" tabindex="0" role="button" aria-label="${esc(l.name)}, подробнее">
        <span class="lamp-card__badge">Распродажа</span>
        <div class="lamp-card__image" ${bg}>${img}</div>
        <div class="lamp-card__glow"></div>
        <div class="lamp-card__footer">
          <p class="lamp-card__brand">${esc(l.brand)} · арт. ${esc(l.article)}</p>
          <h3 class="lamp-card__name">${esc(l.name)}</h3>
          <p class="lamp-card__price-row">
            <span class="lamp-card__price">${formatPrice(l.price)}</span>
            ${oldPriceHtml}
          </p>
          <a class="lamp-card__phone" href="${phoneHref()}" onclick="event.stopPropagation()">${phoneIconSVG}${MANAGER_PHONE}</a>
          <p class="lamp-card__more">Подробнее и характеристики →</p>
        </div>
      </div>`;
  }

  const grid = document.getElementById('lampGrid');

  // ===== Модальное окно с подробной карточкой =====
  const modal = document.getElementById('lampModal');
  const modalImage = document.getElementById('modalImage');
  const modalBody = document.getElementById('modalBody');

  function openModal(l) {
    const safeImage = l.image ? esc(l.image) : '';
    const img = safeImage ? '' : placeholderSVG;
    modalImage.setAttribute('style', safeImage ? `background-image:url('${safeImage}')` : '');
    modalImage.innerHTML = img;

    const oldPriceHtml = l.oldPrice ? `<span class="lamp-modal__old-price">${formatPrice(l.oldPrice)}</span>` : '';

    // Базовые характеристики + любые дополнительные из поля extra
    const baseSpecs = [
      { label: 'Габариты', value: l.dimensions },
      { label: 'Материал', value: l.material }
    ];
    const allSpecs = baseSpecs.concat(Array.isArray(l.extra) ? l.extra : []);
    const specsHtml = allSpecs
      .filter(s => s && s.value)
      .map(s => `<li>${esc(s.label)}<span>${esc(s.value)}</span></li>`)
      .join('');

    modalBody.innerHTML = `
      <span class="lamp-modal__badge">Распродажа</span>
      <p class="lamp-modal__brand">${esc(l.brand)} · арт. ${esc(l.article)}</p>
      <h3 class="lamp-modal__name">${esc(l.name)}</h3>
      <p class="lamp-modal__price-row">
        <span class="lamp-modal__price">${formatPrice(l.price)}</span>
        ${oldPriceHtml}
      </p>
      <a class="lamp-modal__phone" href="${phoneHref()}">${phoneIconSVG}${MANAGER_PHONE}</a>
      <ul class="lamp-modal__specs">${specsHtml}</ul>
      <p class="lamp-modal__desc">${esc(l.description)}</p>
    `;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lamp-modal-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lamp-modal-open');
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  let currentPageItems = [];
  grid.addEventListener('click', function (e) {
    const card = e.target.closest('.lamp-card');
    if (!card) return;
    const idx = Number(card.getAttribute('data-index'));
    const item = currentPageItems[idx];
    if (item) openModal(item);
  });
  grid.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.lamp-card');
    if (!card) return;
    e.preventDefault();
    const idx = Number(card.getAttribute('data-index'));
    const item = currentPageItems[idx];
    if (item) openModal(item);
  });

  // ===== Поиск, категории-чипы, скидка и постраничная навигация =====
  const searchInput = document.getElementById('lampSearch');
  const chips = Array.from(document.querySelectorAll('.lamp-chip'));
  const discountSelect = document.getElementById('filterDiscount');
  const countLabel = document.getElementById('filterCount');
  const pagerPrev = document.getElementById('pagerPrev');
  const pagerNext = document.getElementById('pagerNext');
  const pagerLabel = document.getElementById('pagerLabel');

  const PAGE_SIZE = 16;
  let currentPage = 1;
  let activeType = 'all';
  let lamps = [];
  let fetchFailed = false;

  function getFiltered() {
    const query = searchInput.value.trim().toLowerCase();
    const discountVal = discountSelect.value;

    return lamps.filter(l => {
      const matchesType = activeType === 'all' || l.type === activeType;
      const matchesQuery = !query ||
        l.name.toLowerCase().includes(query) ||
        l.brand.toLowerCase().includes(query) ||
        l.article.toLowerCase().includes(query);

      let matchesDiscount = true;
      if (discountVal !== 'all') {
        const [min, max] = discountVal.split('-').map(Number);
        const d = discountPercent(l);
        matchesDiscount = d >= min && d < max;
      }
      return matchesType && matchesQuery && matchesDiscount;
    });
  }

  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    currentPageItems = filtered.slice(start, start + PAGE_SIZE);

    if (fetchFailed) {
      grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:40px 0;">Каталог временно недоступен. Обновите страницу через минуту.</p>';
      countLabel.textContent = '';
      pagerLabel.textContent = '';
      pagerPrev.disabled = true;
      pagerNext.disabled = true;
      return;
    }

    if (lamps.length === 0) {
      grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:40px 0;">Каталог пока пуст — скоро здесь появятся светильники.</p>';
      countLabel.textContent = 'Найдено: 0';
      pagerLabel.textContent = '';
      pagerPrev.disabled = true;
      pagerNext.disabled = true;
      return;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:40px 0;">Ничего не нашлось. Попробуйте другой запрос или сбросьте фильтры.</p>';
      countLabel.textContent = 'Найдено: 0';
      pagerLabel.textContent = '';
      pagerPrev.disabled = true;
      pagerNext.disabled = true;
      return;
    }

    grid.innerHTML = currentPageItems.map(renderCard).join('');
    countLabel.textContent = `Найдено: ${filtered.length}`;
    pagerLabel.textContent = `Стр. ${currentPage} из ${totalPages}`;
    pagerPrev.disabled = currentPage <= 1;
    pagerNext.disabled = currentPage >= totalPages;
  }

  function renderPaged() {
    render();
    document.getElementById('lamp-sale').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeType = chip.getAttribute('data-value');
      currentPage = 1;
      renderPaged();
    });
  });

  searchInput.addEventListener('input', () => { currentPage = 1; render(); });
  discountSelect.addEventListener('change', () => { currentPage = 1; renderPaged(); });
  pagerPrev.addEventListener('click', () => { currentPage--; renderPaged(); });
  pagerNext.addEventListener('click', () => { currentPage++; renderPaged(); });

  // Загружаем каталог из Supabase (публичное чтение, см. комментарий выше).
  // Кэшируем результат в localStorage на 5 минут: при повторном заходе
  // каталог показывается мгновенно из кэша, а свежие данные подтягиваются
  // в фоне и незаметно подменяют список, если что-то поменялось в админке.
  const CACHE_KEY = 'podium_lamps_cache_v1';
  const CACHE_TTL_MS = 5 * 60 * 1000;

  function mapRows(rows) {
    return rows.map(row => ({
      brand: row.brand,
      article: row.article,
      type: row.type,
      name: row.name,
      price: row.price,
      oldPrice: row.old_price || '',
      dimensions: row.dimensions,
      material: row.material,
      description: row.description,
      image: row.image,
      extra: Array.isArray(row.extra) ? row.extra : []
    }));
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.lamps)) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeCache(lampsData) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ lamps: lampsData, savedAt: Date.now() }));
    } catch (e) {
      // localStorage может быть недоступен (приватный режим и т.п.) — не критично
    }
  }

  // Прямой запрос к Supabase (Швеция) — самый свежий вариант, но у части
  // мобильных операторов в РФ периодически включается режим "белого списка",
  // когда любой иностранный сервис недоступен по таймауту. Поэтому у прямого
  // запроса короткий таймаут (2.5с) — если не успел, сразу переключаемся
  // на резервную копию каталога lamps.json, которая лежит на этом же домене
  // (podium-sale.ru) и обновляется автоматически каждые 5 минут.
  function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
  }

  function fetchLampsDirect() {
    return fetchWithTimeout(`${SUPABASE_URL}/rest/v1/lamps?select=*&order=sort_order.asc`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    }, 2500).then(r => {
      if (!r.ok) throw new Error('Supabase fetch failed: ' + r.status);
      return r.json();
    });
  }

  function fetchLampsFallback() {
    // lamps.json лежит рядом с сайтом на том же российском домене —
    // недоступности "иностранного трафика" тут не бывает.
    return fetch('/lamps.json', { cache: 'no-store' }).then(r => {
      if (!r.ok) throw new Error('Fallback fetch failed: ' + r.status);
      return r.json();
    });
  }

  function fetchLamps() {
    return fetchLampsDirect().catch(err => {
      console.warn('Прямой запрос к Supabase не удался, пробуем резервную копию:', err);
      return fetchLampsFallback();
    });
  }

  const cached = readCache();
  if (cached) {
    // Показываем мгновенно то, что уже есть в браузере
    lamps = cached.lamps;
    render();
  } else {
    countLabel.textContent = 'Загрузка каталога…';
  }

  fetchLamps()
    .then(rows => {
      const fresh = mapRows(rows);
      lamps = fresh;
      fetchFailed = false;
      writeCache(fresh);
      render();
    })
    .catch(err => {
      console.error('Не удалось загрузить каталог ни напрямую, ни из резервной копии:', err);
      if (!cached) {
        fetchFailed = true;
        render();
      }
      // Если кэш есть — молча оставляем показанным то, что уже отрисовано,
      // не пугаем покупателя сообщением об ошибке из-за временного сбоя сети.
    });
})();

(function () {
  // После отправки формы FormSubmit возвращает сюда с ?sent=1 —
  // показываем спасибо вместо того, чтобы человек гадал, ушла ли заявка.
  if (new URLSearchParams(window.location.search).get('sent') === '1') {
    const form = document.getElementById('coopForm');
    if (form) {
      form.innerHTML = '<p style="text-align:center;padding:20px 0;font-size:15px;">Спасибо! Заявка отправлена — мы свяжемся в ближайшее время.</p>';
    }
    // Убираем ?sent=1 из адресной строки, чтобы сообщение не оставалось при обновлении
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
  }
})();
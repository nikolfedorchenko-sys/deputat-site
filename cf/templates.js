// АВТОГЕНЕРОВАНО scripts/build-templates.mjs — не редагуйте вручну, правте views/*.ejs
export const templates = {
  "index": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
s = __locals.s,
  news = __locals.news,
  achievements = __locals.achievements,
  post = __locals.post,
  bodyHtml = __locals.bodyHtml,
  extraImages = __locals.extraImages,
  username = __locals.username,
  error = __locals.error,
  esc = __locals.esc,
  nl2br = __locals.nl2br,
  paragraphs = __locals.paragraphs,
  stripPhotoTokens = __locals.stripPhotoTokens;
    ; __append("<!DOCTYPE html>\n<html lang=\"uk\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n\n  <!-- SEO -->\n  <title>")
    ; __append(escapeFn( s.meta_title || s.hero_name ))
    ; __append("</title>\n  <meta name=\"description\" content=\"")
    ; __append(escapeFn( s.meta_description ))
    ; __append("\" />\n\n  <!-- OpenGraph -->\n  <meta property=\"og:type\" content=\"website\" />\n  <meta property=\"og:title\" content=\"")
    ; __append(escapeFn( s.meta_title || s.hero_name ))
    ; __append("\" />\n  <meta property=\"og:description\" content=\"")
    ; __append(escapeFn( s.meta_description ))
    ; __append("\" />\n  <meta property=\"og:image\" content=\"")
    ; __append(escapeFn( s.og_image || s.hero_photo ))
    ; __append("\" />\n  <meta property=\"og:locale\" content=\"uk_UA\" />\n  <meta name=\"twitter:card\" content=\"summary_large_image\" />\n\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link rel=\"preconnect\" href=\"https://cdn.jsdelivr.net\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"/css/style.css\" />\n</head>\n<body>\n\n<!-- Прогрес-бар прокрутки -->\n<div id=\"pbar\"></div>\n\n<!-- ─────────────── Навбар ─────────────── -->\n<nav id=\"siteNav\" class=\"nav\" aria-label=\"Головна навігація\">\n  <a class=\"nav__brand\" href=\"#top\" aria-label=\"На початок\">\n    <span class=\"mono\">ЮТ</span>\n    <span class=\"nav__id\">\n      <span class=\"nav__name\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</span>\n      <span class=\"nav__role\">Депутат Київради · округ №12</span>\n    </span>\n  </a>\n\n  <div class=\"nav__links\" id=\"navLinks\">\n    <a href=\"#about\" class=\"nl\" data-target=\"about\">Про депутата</a>\n    <a href=\"#activity\" class=\"nl\" data-target=\"activity\">Діяльність</a>\n    <a href=\"#results\" class=\"nl\" data-target=\"results\">Досягнення</a>\n    <a href=\"#army\" class=\"nl\" data-target=\"army\">Захисникам</a>\n    <a href=\"#news\" class=\"nl\" data-target=\"news\">Новини</a>\n    <a href=\"#contacts\" class=\"nl\" data-target=\"contacts\">Контакти</a>\n  </div>\n\n  <a href=\"#contacts\" class=\"btn-g nav__cta\">Звернутися</a>\n  <button class=\"nav-toggle\" id=\"navToggle\" aria-label=\"Меню\" aria-expanded=\"false\">\n    <span></span><span></span><span></span>\n  </button>\n</nav>\n\n<main id=\"top\">\n  <!-- ─────────────── Hero ─────────────── -->\n  <section class=\"hero\" data-reveal=\"load\">\n    <span class=\"aur aur--indigo\"></span>\n    <span class=\"aur aur--cyan\"></span>\n    <div class=\"hero__dots\" data-parallax></div>\n\n    <div class=\"hero__inner wrap\">\n      <div class=\"hero__text\">\n        <div class=\"eyebrow\" data-rv><span class=\"eyebrow__line\"></span>")
    ; __append(escapeFn( s.hero_eyebrow ))
    ; __append("</div>\n        ")
    ;  const _p = String(s.hero_name || '').split(' '); const _surname = _p.shift(); const _rest = _p.join(' '); 
    ; __append("\n        <h1 class=\"gtext hero__name\" data-rv>")
    ; __append(escapeFn( _surname ))
    ; __append("<br>")
    ; __append(escapeFn( _rest ))
    ; __append("</h1>\n        <div class=\"chips\" data-rv>\n          <span class=\"chip\">")
    ; __append(escapeFn( s.hero_role1 ))
    ; __append("</span>\n          <span class=\"chip\">")
    ; __append(escapeFn( s.hero_role2 ))
    ; __append("</span>\n          ")
    ;  if (s.hero_role3) { 
    ; __append("<span class=\"chip\">")
    ; __append(escapeFn( s.hero_role3 ))
    ; __append("</span>")
    ;  } 
    ; __append("\n        </div>\n        <p class=\"lead\" data-rv>")
    ; __append(escapeFn( s.hero_slogan ))
    ; __append("</p>\n        <div class=\"hero__actions\" data-rv>\n          <a href=\"#contacts\" class=\"btn-g btn-lg\">Звернутися до депутата</a>\n          <a href=\"#news\" class=\"btn-glass btn-lg\">Новини округу</a>\n        </div>\n      </div>\n      <div class=\"hero__photo\" data-rv=\"scale\">\n        <span class=\"hero__glow\"></span>\n        <div class=\"hero__frame\">\n          <img src=\"")
    ; __append(escapeFn( s.hero_photo ))
    ; __append("\" alt=\"Фото: ")
    ; __append(escapeFn( esc(s.hero_name) ))
    ; __append("\" width=\"460\" height=\"520\" />\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- ─────────────── Про депутата ─────────────── -->\n  <section id=\"about\" class=\"section section--white\" data-reveal>\n    <div class=\"wrap\">\n      <div class=\"sec-head\" data-rv><span class=\"sec-bar\"></span><h2>Про депутата</h2></div>\n      <div class=\"about-grid\">\n        <div class=\"about-left\" data-rv=\"left\">\n          <figure class=\"gitem about-photo\" data-rv=\"clip\">\n            <img class=\"gzoom\" src=\"/img/deputy-about.jpg\" alt=\"Юрій Тихонович — робочий момент\" />\n            <figcaption class=\"gcap\">Юрій Тихонович — робочий момент</figcaption>\n          </figure>\n          <div class=\"fact-card\">\n            <div><span>Народився:</span> <strong>21.06.1970, м. Київ</strong></div>\n            <div><span>Науковий ступінь:</span> <strong>кандидат юридичних наук</strong></div>\n            <div><span>Фракція:</span> <strong>«Європейська Солідарність»</strong></div>\n            <div><span>Округ:</span> <strong>№12, Солом’янський район</strong></div>\n            <div><span>Депутат Київради:</span> <strong>з 2020 року</strong></div>\n          </div>\n        </div>\n\n        <div class=\"about-right\" data-rv=\"right\">\n          <div class=\"prose about-bio\">")
    ; __append( paragraphs(s.bio) )
    ; __append("</div>\n          <h3 class=\"about-subhead\">Освіта та кар’єра</h3>\n          <div class=\"timeline\">\n            <div class=\"tl-row\">\n              <div class=\"tl-year\">2020</div>\n              <div class=\"tl-dot\"><span class=\"tl-mark tl-mark--grad\"></span><span class=\"tl-line\"></span></div>\n              <div class=\"tl-body\">Обраний депутатом Київської міської ради IX скликання, округ №12. Перший заступник голови постійної комісії з питань ЖКГ та ПЕК.</div>\n            </div>\n            <div class=\"tl-row\">\n              <div class=\"tl-year\">з 2020</div>\n              <div class=\"tl-dot\"><span class=\"tl-mark\"></span><span class=\"tl-line\"></span></div>\n              <div class=\"tl-body\">Заступник директора ТОВ «АЙ СІ ТІ»; член правління ПрАТ «ХК «Київміськбуд».</div>\n            </div>\n            <div class=\"tl-row\">\n              <div class=\"tl-year\">2015</div>\n              <div class=\"tl-dot\"><span class=\"tl-mark\"></span><span class=\"tl-line\"></span></div>\n              <div class=\"tl-body\">Здобув науковий ступінь кандидата юридичних наук (Київський національний університет імені Тараса Шевченка).</div>\n            </div>\n            <div class=\"tl-row\">\n              <div class=\"tl-year\">2011–2013</div>\n              <div class=\"tl-dot\"><span class=\"tl-mark\"></span><span class=\"tl-line\"></span></div>\n              <div class=\"tl-body\">Засновник інвестиційно-будівельних компаній «Альянс капітал» (2011) та «Столиця майбутнього» (2013).</div>\n            </div>\n            <div class=\"tl-row\">\n              <div class=\"tl-year\">2011</div>\n              <div class=\"tl-dot\"><span class=\"tl-mark\"></span><span class=\"tl-line\"></span></div>\n              <div class=\"tl-body\">КНУБА — «Міське будівництво та господарство» (інженер-будівельник). Раніше (2007) — Київський славістичний університет, «Менеджмент організацій».</div>\n            </div>\n            <div class=\"tl-row\">\n              <div class=\"tl-year\">2004–2008</div>\n              <div class=\"tl-dot\"><span class=\"tl-mark\"></span></div>\n              <div class=\"tl-body\">Заступник директора КП «Інженерний центр» КМДА (2004–2006) та ВБК «Компроміс-ТВ» (2006–2008); помічник-консультант народних депутатів України (2005–2007).</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- ─────────────── Депутатська діяльність ─────────────── -->\n  <section id=\"activity\" class=\"section section--tint\" data-reveal>\n    <div class=\"wrap\">\n      <div class=\"sec-head\" data-rv><span class=\"sec-bar\"></span><h2>Депутатська діяльність</h2></div>\n      <div class=\"cards-3\">\n        <article class=\"card card-t\" data-rv=\"scale\" data-tilt>\n          <div class=\"ic ic--grid\"><span></span><span></span><span></span><span></span></div>\n          <h3>Округ №12</h3>\n          <span class=\"ibar\"></span>\n          <p>")
    ; __append(escapeFn( s.activity_district ))
    ; __append("</p>\n        </article>\n        <article class=\"card card-t\" data-rv=\"scale\" data-tilt>\n          <div class=\"ic ic--lines\"><span></span><span></span><span></span></div>\n          <h3>Комісія з питань ЖКГ та ПЕК</h3>\n          <span class=\"ibar\"></span>\n          <p>")
    ; __append(escapeFn( s.activity_position ))
    ; __append("</p>\n        </article>\n        <article class=\"card card-t\" data-rv=\"scale\" data-tilt>\n          <div class=\"ic ic--circle\"><span></span></div>\n          <h3>Напрямки роботи</h3>\n          <span class=\"ibar\"></span>\n          <p>")
    ; __append(escapeFn( s.activity_intro ))
    ; __append("</p>\n        </article>\n      </div>\n    </div>\n  </section>\n\n  <!-- ─────────────── Результати роботи ─────────────── -->\n  <section id=\"results\" class=\"section section--results\" data-reveal>\n    <div class=\"results__dots\"></div>\n    <span class=\"aur aur--indigo aur--soft\"></span>\n    <div class=\"wrap\">\n      <div class=\"sec-head\" data-rv><span class=\"sec-bar\"></span><h2>Результати роботи</h2></div>\n      <div class=\"cards-4\">\n        ")
    ;  achievements.forEach(function(a, i){ const m = String(a.title).match(/^(\d+)(.*)$/); 
    ; __append("\n          <div class=\"stat ")
    ; __append(escapeFn( i === 0 ? 'stat--hl' : '' ))
    ; __append("\" data-rv=\"scale\">\n            <div class=\"gnum stat__num\">\n              ")
    ;  if (m) { 
    ; __append("<span data-count=\"")
    ; __append(escapeFn( m[1] ))
    ; __append("\">0</span>")
    ; __append(escapeFn( m[2] ))
    ;  } else { 
    ; __append(escapeFn( a.title ))
    ;  } 
    ; __append("\n            </div>\n            <div class=\"stat__desc\">")
    ; __append(escapeFn( a.body ))
    ; __append("</div>\n          </div>\n        ")
    ;  }); 
    ; __append("\n        ")
    ;  if (achievements.length === 0) { 
    ; __append("\n          <p class=\"muted\">Показники додаються в адмінпанелі (розділ «Досягнення»).</p>\n        ")
    ;  } 
    ; __append("\n      </div>\n      <div class=\"gallery-more\" data-rv><a class=\"btn-g btn-lg\" href=\"/report\">Детальний звіт 2021–2025 →</a></div>\n    </div>\n  </section>\n\n  <!-- ─────────────── Підтримка Захисників ─────────────── -->\n  <section id=\"army\" class=\"section section--white\" data-reveal>\n    <div class=\"wrap\">\n      <div class=\"sec-head\" data-rv><span class=\"sec-bar\"></span><h2>Підтримка Захисників</h2></div>\n      <p class=\"army-intro\" data-rv>\n        Від перших днів повномасштабного вторгнення — системна допомога Силам оборони:\n        ударні та розвідувальні дрони, засоби РЕБ, Starlink, генератори, автомобілі й\n        спорядження. Серед підрозділів — 92-га ОШБр імені Івана Сірка, 429-й полк\n        безпілотних систем «Ахіллес», ЦСО «Альфа» СБУ, ГУР, 241-ша та 112-та бригади ТрО.\n      </p>\n      <ul class=\"army-highlights\" data-rv>\n        <li><b>2022 — 2025</b><span>щороку, без перерв</span></li>\n        <li><b>24 виїзди</b><span>на фронт лише за 2024 рік</span></li>\n        <li><b>10+ підрозділів</b><span>ЗСУ, ТрО, ГУР, «Альфа» СБУ</span></li>\n        <li><b>Сотні FPV</b><span>ударні дрони-камікадзе</span></li>\n        <li><b>РЕБ «Купол»</b><span>захист від ворожих дронів</span></li>\n        <li><b>4 МЛПК</b><span>мобільні лазне-пральні комплекси для ТрО</span></li>\n      </ul>\n      <div class=\"report-photos army-photos\" data-rv>\n        <figure><img src=\"/img/army/home-1.jpg\" alt=\"Автомобіль для військових\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/home-2.jpg\" alt=\"Підтримка полку «Ахіллес»\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/home-3.jpg\" alt=\"Інженерна техніка для фортифікацій\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/home-4.jpg\" alt=\"Спорядження для Сил оборони\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/home-5.jpg\" alt=\"Генератори та обладнання військовим\" loading=\"lazy\"></figure>\n      </div>\n      <div class=\"gallery-more\" data-rv><a class=\"btn-g btn-lg\" href=\"/army\">Повна хронологія 2022–2025 →</a></div>\n    </div>\n  </section>\n\n  <!-- ─────────────── Новини ─────────────── -->\n  <section id=\"news\" class=\"section section--white\" data-reveal>\n    <div class=\"wrap\">\n      <div class=\"news-head\" data-rv>\n        <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>Новини</h2></div>\n        <a class=\"all-news\" href=\"/news\">Усі новини →</a>\n      </div>\n      <div class=\"cards-3\">\n        ")
    ;  news.slice(0, 6).forEach(function(n){ 
    ; __append("\n          <a href=\"/news/")
    ; __append(escapeFn( n.id ))
    ; __append("\" class=\"news-card card-t\" data-rv=\"scale\" data-tilt>\n            <div class=\"gitem news-card__img\">\n              ")
    ;  if (n.cover_image) { 
    ; __append("\n                <img class=\"gzoom\" src=\"")
    ; __append(escapeFn( n.cover_image ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( esc(n.title) ))
    ; __append("\" loading=\"lazy\" />\n              ")
    ;  } else { 
    ; __append("\n                <div class=\"gzoom ph-img\"><span>[ фото новини ]</span></div>\n              ")
    ;  } 
    ; __append("\n            </div>\n            <div class=\"news-card__body\">\n              <div class=\"news-card__meta\">\n                ")
    ;  if (n.tag) { 
    ; __append("<span class=\"tag\">")
    ; __append(escapeFn( n.tag ))
    ; __append("</span>")
    ;  } 
    ; __append("\n                <time datetime=\"")
    ; __append(escapeFn( n.date ))
    ; __append("\">")
    ; __append(escapeFn( n.date.split('-').reverse().join('.') ))
    ; __append("</time>\n              </div>\n              <h3 class=\"news-card__title\">")
    ; __append(escapeFn( n.title ))
    ; __append("</h3>\n              ")
    ;  const teaser = stripPhotoTokens(n.body).replace(/\s+/g, ' ').trim(); 
    ; __append("\n              ")
    ;  if (teaser) { 
    ; __append("<p class=\"news-card__text\">")
    ; __append(escapeFn( teaser.length > 120 ? teaser.slice(0, 120) + '…' : teaser ))
    ; __append("</p>")
    ;  } 
    ; __append("\n              <span class=\"news-card__more\">Читати повністю →</span>\n            </div>\n          </a>\n        ")
    ;  }); 
    ; __append("\n        ")
    ;  if (news.length === 0) { 
    ; __append("\n          <p class=\"muted\">Новини з’являться незабаром.</p>\n        ")
    ;  } 
    ; __append("\n      </div>\n    </div>\n  </section>\n\n  <!-- ─────────────── Приймальня / контакти ─────────────── -->\n  <section id=\"contacts\" class=\"section section--contacts\" data-reveal>\n    <div class=\"contacts__dots\"></div>\n    <span class=\"aur aur--cyan aur--soft\"></span>\n    <div class=\"wrap\">\n      <div class=\"sec-head sec-head--light\" data-rv><span class=\"sec-bar\"></span><h2>Депутатська приймальня</h2></div>\n      <div class=\"contacts-grid\">\n        <div class=\"contacts-left\" data-rv=\"left\">\n          <div class=\"contact-block\">\n            <div class=\"contact-label\">Адреса</div>\n            ")
    ; __append(escapeFn( s.contact_address ))
    ; __append("\n            ")
    ;  if (s.contact_hours) { 
    ; __append("<br><span class=\"contact-note\">")
    ; __append(escapeFn( s.contact_hours ))
    ; __append("</span>")
    ;  } 
    ; __append("\n          </div>\n          <div class=\"contact-block\">\n            <div class=\"contact-label\">Телефони</div>\n            ")
    ; __append(escapeFn( s.contact_phones ))
    ; __append("\n          </div>\n          ")
    ;  if (s.contact_email) { 
    ; __append("\n          <div class=\"contact-block\">\n            <div class=\"contact-label\">Email</div>\n            ")
    ; __append(escapeFn( s.contact_email ))
    ; __append("\n          </div>\n          ")
    ;  } 
    ; __append("\n          ")
    ;  if (s.contact_email_reception) { 
    ; __append("\n          <div class=\"contact-block\">\n            <div class=\"contact-label\">Email приймальні</div>\n            ")
    ; __append(escapeFn( s.contact_email_reception ))
    ; __append("\n          </div>\n          ")
    ;  } 
    ; __append("\n\n          <div class=\"contact-map\">\n            ")
    ;  if (s.map_embed) { 
    ; __append("\n              ")
    ; __append( s.map_embed )
    ; __append("\n            ")
    ;  } else { 
    ; __append("\n              <iframe\n                src=\"https://www.openstreetmap.org/export/embed.html?bbox=30.4409%2C50.4455%2C30.4569%2C50.4525&amp;layer=mapnik&amp;marker=50.4490239%2C30.4489483\"\n                title=\"Карта — приймальня, вул. Михайла Брайчевського, 9\" loading=\"lazy\"></iframe>\n            ")
    ;  } 
    ; __append("\n          </div>\n          <div class=\"contact-mapnote\">Карта: © OpenStreetMap contributors</div>\n        </div>\n\n        <!-- Форма звернення -->\n        <form class=\"contact-form card\" id=\"contactForm\" novalidate data-rv=\"right\">\n          <h3>Форма звернення</h3>\n          <p class=\"contact-form__sub\">Опишіть проблему — команда депутата відповість на вказаний контакт.</p>\n          <div id=\"formMsg\" class=\"form__msg\" role=\"status\" aria-live=\"polite\"></div>\n\n          <div class=\"form-grid\">\n            <label class=\"field\">Ім’я та прізвище\n              <input type=\"text\" name=\"name\" required minlength=\"2\" maxlength=\"120\" autocomplete=\"name\" placeholder=\"Ваше ім’я\" />\n            </label>\n            <label class=\"field\">Телефон або email\n              <input type=\"text\" name=\"contact\" required minlength=\"3\" maxlength=\"200\" placeholder=\"Як з вами зв’язатися\" />\n            </label>\n            <label class=\"field field--full\">Тема звернення\n              <select name=\"subject\">\n                <option value=\"ЖКГ\">ЖКГ</option>\n                <option value=\"Благоустрій\">Благоустрій</option>\n                <option value=\"Інше\" selected>Інше</option>\n              </select>\n            </label>\n            <label class=\"field field--full\">Повідомлення\n              <textarea name=\"message\" required minlength=\"5\" maxlength=\"4000\" rows=\"4\" placeholder=\"Опишіть суть звернення…\"></textarea>\n            </label>\n          </div>\n\n          <!-- Honeypot -->\n          <div class=\"hp\" aria-hidden=\"true\">\n            <label>Website<input type=\"text\" name=\"website\" tabindex=\"-1\" autocomplete=\"off\" /></label>\n          </div>\n\n          <button type=\"submit\" class=\"btn-g btn-lg btn-block\">Надіслати звернення</button>\n        </form>\n      </div>\n    </div>\n  </section>\n</main>\n\n<!-- ─────────────── Футер ─────────────── -->\n<div class=\"foot-line\"></div>\n<footer class=\"footer\" data-reveal>\n  <div class=\"wrap foot-inner\" data-rv>\n    <div class=\"foot-brand\">\n      <span class=\"mono\">ЮТ</span>\n      <span class=\"foot-id\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("<br><span>Депутат Київради · округ №12</span></span>\n    </div>\n    <nav class=\"foot-links\" aria-label=\"Офіційні посилання\">\n      ")
    ;  if (s.kyivrada_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.kyivrada_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Профіль на сайті Київради</a>")
    ;  } 
    ; __append("\n      ")
    ;  if (s.facebook_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.facebook_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Facebook: Юрій Тихонович</a>")
    ;  } 
    ; __append("\n    </nav>\n    <div class=\"foot-copy\">© ")
    ; __append(escapeFn( new Date().getFullYear() ))
    ; __append(". Усі права захищені.</div>\n  </div>\n</footer>\n\n<script src=\"/js/main.js\"></script>\n</body>\n</html>\n")
  return __output;

},
  "news": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
s = __locals.s,
  news = __locals.news,
  achievements = __locals.achievements,
  post = __locals.post,
  bodyHtml = __locals.bodyHtml,
  extraImages = __locals.extraImages,
  username = __locals.username,
  error = __locals.error,
  esc = __locals.esc,
  nl2br = __locals.nl2br,
  paragraphs = __locals.paragraphs,
  stripPhotoTokens = __locals.stripPhotoTokens;
    ; __append("<!DOCTYPE html>\n<html lang=\"uk\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>")
    ; __append(escapeFn( post.title ))
    ; __append(" — ")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</title>\n  <meta name=\"description\" content=\"")
    ; __append(escapeFn( esc(post.body).slice(0,160) ))
    ; __append("\" />\n  <meta property=\"og:type\" content=\"article\" />\n  <meta property=\"og:title\" content=\"")
    ; __append(escapeFn( esc(post.title) ))
    ; __append("\" />\n  <meta property=\"og:image\" content=\"")
    ; __append(escapeFn( post.cover_image || s.og_image ))
    ; __append("\" />\n\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link rel=\"preconnect\" href=\"https://cdn.jsdelivr.net\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"/css/style.css\" />\n</head>\n<body>\n\n<div id=\"pbar\"></div>\n\n<nav id=\"siteNav\" class=\"nav\" aria-label=\"Головна навігація\">\n  <a class=\"nav__brand\" href=\"/\" aria-label=\"На головну\">\n    <span class=\"mono\">ЮТ</span>\n    <span class=\"nav__id\">\n      <span class=\"nav__name\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</span>\n      <span class=\"nav__role\">Депутат Київради · округ №12</span>\n    </span>\n  </a>\n  <div class=\"nav__links\" id=\"navLinks\">\n    <a href=\"/#about\" class=\"nl\">Про депутата</a>\n    <a href=\"/#activity\" class=\"nl\">Діяльність</a>\n    <a href=\"/#results\" class=\"nl\">Досягнення</a>\n    <a href=\"/#army\" class=\"nl\">Захисникам</a>\n    <a href=\"/#news\" class=\"nl\">Новини</a>\n    <a href=\"/#contacts\" class=\"nl\">Контакти</a>\n  </div>\n  <a href=\"/#contacts\" class=\"btn-g nav__cta\">Звернутися</a>\n  <button class=\"nav-toggle\" id=\"navToggle\" aria-label=\"Меню\" aria-expanded=\"false\">\n    <span></span><span></span><span></span>\n  </button>\n</nav>\n\n<main>\n  <article class=\"section section--white news-article\">\n    <div class=\"wrap wrap--narrow\">\n      <a class=\"gallery-back\" href=\"/news\">← Усі новини</a>\n      <div class=\"news-article__meta\">\n        ")
    ;  if (post.tag) { 
    ; __append("<span class=\"tag\">")
    ; __append(escapeFn( post.tag ))
    ; __append("</span>")
    ;  } 
    ; __append("\n        <time datetime=\"")
    ; __append(escapeFn( post.date ))
    ; __append("\">")
    ; __append(escapeFn( post.date.split('-').reverse().join('.') ))
    ; __append("</time>\n      </div>\n      <h1 class=\"news-article__title\">")
    ; __append(escapeFn( post.title ))
    ; __append("</h1>\n\n      ")
    ;  if (post.cover_image) { 
    ; __append("\n        <figure class=\"news-article__cover\">\n          <img src=\"")
    ; __append(escapeFn( post.cover_image ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( esc(post.title) ))
    ; __append("\" />\n        </figure>\n      ")
    ;  } 
    ; __append("\n\n      <div class=\"prose news-article__body\">")
    ; __append( bodyHtml )
    ; __append("</div>\n    </div>\n\n    ")
    ;  if (extraImages && extraImages.length) { 
    ; __append("\n      <div class=\"wrap news-article__gallery\">\n        <h2 class=\"news-article__gallery-title\">Фото</h2>\n        <div class=\"news-article__photos\" id=\"galleryGrid\">\n          ")
    ;  extraImages.forEach(function(img){ 
    ; __append("\n            <figure class=\"gitem\">\n              <img class=\"gzoom\" src=\"")
    ; __append(escapeFn( img.path ))
    ; __append("\" alt=\"Фото до новини\" loading=\"lazy\" />\n            </figure>\n          ")
    ;  }); 
    ; __append("\n        </div>\n      </div>\n    ")
    ;  } 
    ; __append("\n\n    <div class=\"wrap wrap--narrow\">\n      <div class=\"news-article__foot\">\n        <a class=\"btn-g btn-lg\" href=\"/#news\">← Повернутися до новин</a>\n      </div>\n    </div>\n  </article>\n</main>\n\n<div class=\"foot-line\"></div>\n<footer class=\"footer\">\n  <div class=\"wrap foot-inner\">\n    <div class=\"foot-brand\">\n      <span class=\"mono\">ЮТ</span>\n      <span class=\"foot-id\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("<br><span>Депутат Київради · округ №12</span></span>\n    </div>\n    <nav class=\"foot-links\" aria-label=\"Офіційні посилання\">\n      ")
    ;  if (s.kyivrada_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.kyivrada_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Профіль на сайті Київради</a>")
    ;  } 
    ; __append("\n      ")
    ;  if (s.facebook_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.facebook_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Facebook: Юрій Тихонович</a>")
    ;  } 
    ; __append("\n    </nav>\n    <div class=\"foot-copy\">© ")
    ; __append(escapeFn( new Date().getFullYear() ))
    ; __append(". Усі права захищені.</div>\n  </div>\n</footer>\n\n<script src=\"/js/main.js\"></script>\n</body>\n</html>\n")
  return __output;

},
  "news-list": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
s = __locals.s,
  news = __locals.news,
  achievements = __locals.achievements,
  post = __locals.post,
  bodyHtml = __locals.bodyHtml,
  extraImages = __locals.extraImages,
  username = __locals.username,
  error = __locals.error,
  esc = __locals.esc,
  nl2br = __locals.nl2br,
  paragraphs = __locals.paragraphs,
  stripPhotoTokens = __locals.stripPhotoTokens;
    ; __append("<!DOCTYPE html>\n<html lang=\"uk\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Новини — ")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</title>\n  <meta name=\"description\" content=\"Новини депутата Київради ")
    ; __append(escapeFn( s.hero_name ))
    ; __append(": робота в Київраді, Київміськбуді, «Медбуді» та на окрузі №12.\" />\n  <meta property=\"og:title\" content=\"Новини — ")
    ; __append(escapeFn( s.hero_name ))
    ; __append("\" />\n  <meta property=\"og:image\" content=\"")
    ; __append(escapeFn( (news[0] && news[0].cover_image) || s.og_image ))
    ; __append("\" />\n\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link rel=\"preconnect\" href=\"https://cdn.jsdelivr.net\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"/css/style.css\" />\n</head>\n<body>\n\n<div id=\"pbar\"></div>\n\n<!-- Навбар (посилання ведуть на головну) -->\n<nav id=\"siteNav\" class=\"nav\" aria-label=\"Головна навігація\">\n  <a class=\"nav__brand\" href=\"/\" aria-label=\"На головну\">\n    <span class=\"mono\">ЮТ</span>\n    <span class=\"nav__id\">\n      <span class=\"nav__name\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</span>\n      <span class=\"nav__role\">Депутат Київради · округ №12</span>\n    </span>\n  </a>\n  <div class=\"nav__links\" id=\"navLinks\">\n    <a href=\"/#about\" class=\"nl\">Про депутата</a>\n    <a href=\"/#activity\" class=\"nl\">Діяльність</a>\n    <a href=\"/#results\" class=\"nl\">Досягнення</a>\n    <a href=\"/#army\" class=\"nl\">Захисникам</a>\n    <a href=\"/#news\" class=\"nl\">Новини</a>\n    <a href=\"/#contacts\" class=\"nl\">Контакти</a>\n  </div>\n  <a href=\"/#contacts\" class=\"btn-g nav__cta\">Звернутися</a>\n  <button class=\"nav-toggle\" id=\"navToggle\" aria-label=\"Меню\" aria-expanded=\"false\">\n    <span></span><span></span><span></span>\n  </button>\n</nav>\n\n<main>\n  <section class=\"section section--white news-page\">\n    <div class=\"wrap\">\n      <a class=\"gallery-back\" href=\"/\">← На головну</a>\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>Новини</h2></div>\n      ")
    ;  if (news.length) { 
    ; __append("\n        <div class=\"cards-3\">\n          ")
    ;  news.forEach(function(n){ 
    ; __append("\n            <a href=\"/news/")
    ; __append(escapeFn( n.id ))
    ; __append("\" class=\"news-card card-t\">\n              <div class=\"gitem news-card__img\">\n                ")
    ;  if (n.cover_image) { 
    ; __append("\n                  <img class=\"gzoom\" src=\"")
    ; __append(escapeFn( n.cover_image ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( esc(n.title) ))
    ; __append("\" loading=\"lazy\" />\n                ")
    ;  } else { 
    ; __append("\n                  <div class=\"gzoom ph-img\"><span>[ фото новини ]</span></div>\n                ")
    ;  } 
    ; __append("\n              </div>\n              <div class=\"news-card__body\">\n                <div class=\"news-card__meta\">\n                  ")
    ;  if (n.tag) { 
    ; __append("<span class=\"tag\">")
    ; __append(escapeFn( n.tag ))
    ; __append("</span>")
    ;  } 
    ; __append("\n                  <time datetime=\"")
    ; __append(escapeFn( n.date ))
    ; __append("\">")
    ; __append(escapeFn( n.date.split('-').reverse().join('.') ))
    ; __append("</time>\n                </div>\n                <h3 class=\"news-card__title\">")
    ; __append(escapeFn( n.title ))
    ; __append("</h3>\n                ")
    ;  const teaser = stripPhotoTokens(n.body).replace(/\s+/g, ' ').trim(); 
    ; __append("\n                ")
    ;  if (teaser) { 
    ; __append("<p class=\"news-card__text\">")
    ; __append(escapeFn( teaser.length > 120 ? teaser.slice(0, 120) + '…' : teaser ))
    ; __append("</p>")
    ;  } 
    ; __append("\n                <span class=\"news-card__more\">Читати повністю →</span>\n              </div>\n            </a>\n          ")
    ;  }); 
    ; __append("\n        </div>\n      ")
    ;  } else { 
    ; __append("\n        <p class=\"muted\">Новини з’являться незабаром.</p>\n      ")
    ;  } 
    ; __append("\n    </div>\n  </section>\n</main>\n\n<div class=\"foot-line\"></div>\n<footer class=\"footer\">\n  <div class=\"wrap foot-inner\">\n    <div class=\"foot-brand\">\n      <span class=\"mono\">ЮТ</span>\n      <span class=\"foot-id\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("<br><span>Депутат Київради · округ №12</span></span>\n    </div>\n    <nav class=\"foot-links\" aria-label=\"Офіційні посилання\">\n      ")
    ;  if (s.kyivrada_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.kyivrada_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Профіль на сайті Київради</a>")
    ;  } 
    ; __append("\n      ")
    ;  if (s.facebook_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.facebook_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Facebook: Юрій Тихонович</a>")
    ;  } 
    ; __append("\n    </nav>\n    <div class=\"foot-copy\">© ")
    ; __append(escapeFn( new Date().getFullYear() ))
    ; __append(". Усі права захищені.</div>\n  </div>\n</footer>\n\n<script src=\"/js/main.js\"></script>\n</body>\n</html>\n")
  return __output;

},
  "report": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
s = __locals.s,
  news = __locals.news,
  achievements = __locals.achievements,
  post = __locals.post,
  bodyHtml = __locals.bodyHtml,
  extraImages = __locals.extraImages,
  username = __locals.username,
  error = __locals.error,
  esc = __locals.esc,
  nl2br = __locals.nl2br,
  paragraphs = __locals.paragraphs,
  stripPhotoTokens = __locals.stripPhotoTokens;
    ; __append("<!DOCTYPE html>\n<html lang=\"uk\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Звіт про діяльність 2021–2025 — ")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</title>\n  <meta name=\"description\" content=\"Звіт про депутатську діяльність Юрія Тихоновича за 2021–2025 роки: матеріальна допомога, ремонти й благоустрій округу №12, вирішені звернення, гуманітарна допомога.\" />\n  <meta property=\"og:title\" content=\"Звіт про діяльність 2021–2025 — ")
    ; __append(escapeFn( s.hero_name ))
    ; __append("\" />\n  <meta property=\"og:image\" content=\"")
    ; __append(escapeFn( s.og_image ))
    ; __append("\" />\n\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link rel=\"preconnect\" href=\"https://cdn.jsdelivr.net\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"/css/style.css\" />\n</head>\n<body>\n\n<div id=\"pbar\"></div>\n\n<nav id=\"siteNav\" class=\"nav\" aria-label=\"Головна навігація\">\n  <a class=\"nav__brand\" href=\"/\" aria-label=\"На головну\">\n    <span class=\"mono\">ЮТ</span>\n    <span class=\"nav__id\">\n      <span class=\"nav__name\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</span>\n      <span class=\"nav__role\">Депутат Київради · округ №12</span>\n    </span>\n  </a>\n  <div class=\"nav__links\" id=\"navLinks\">\n    <a href=\"/#about\" class=\"nl\">Про депутата</a>\n    <a href=\"/#activity\" class=\"nl\">Діяльність</a>\n    <a href=\"/#results\" class=\"nl\">Досягнення</a>\n    <a href=\"/#army\" class=\"nl\">Захисникам</a>\n    <a href=\"/#news\" class=\"nl\">Новини</a>\n    <a href=\"/#contacts\" class=\"nl\">Контакти</a>\n  </div>\n  <a href=\"/#contacts\" class=\"btn-g nav__cta\">Звернутися</a>\n  <button class=\"nav-toggle\" id=\"navToggle\" aria-label=\"Меню\" aria-expanded=\"false\">\n    <span></span><span></span><span></span>\n  </button>\n</nav>\n\n<main class=\"report\">\n  <!-- Заголовок -->\n  <header class=\"section section--tint report-hero\">\n    <div class=\"wrap\">\n      <a class=\"gallery-back\" href=\"/#results\">← На головну</a>\n      <div class=\"eyebrow\"><span class=\"eyebrow__line\"></span>Округ №12 · Солом’янський район</div>\n      <h1 class=\"gtext report-hero__title\">Звіт про діяльність<br>2021–2025</h1>\n      <p class=\"lead\">Що зроблено для мешканців округу за поточне скликання — коротко про головне: адресна допомога, ремонти й благоустрій, вирішені звернення та підтримка людей.</p>\n    </div>\n  </header>\n\n  <!-- Ключові показники -->\n  <section class=\"section section--white\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>Ключові показники</h2></div>\n      <div class=\"cards-3 report-stats\">\n        <div class=\"stat stat--hl\"><div class=\"gnum stat__num\">4009</div><div class=\"stat__desc\">мешканців отримали матеріальну допомогу на <strong>12 667 919 грн</strong></div></div>\n        <div class=\"stat\"><div class=\"gnum stat__num\">571</div><div class=\"stat__desc\">особа отримала допомогу за програмою «Турбота. Назустріч киянам»</div></div>\n        <div class=\"stat\"><div class=\"gnum stat__num\">154</div><div class=\"stat__desc\">участей у робочих і підготовчих групах, комісіях</div></div>\n        <div class=\"stat\"><div class=\"gnum stat__num\">61</div><div class=\"stat__desc\">поданий проєкт рішення Київради</div></div>\n        <div class=\"stat\"><div class=\"gnum stat__num\">78</div><div class=\"stat__desc\">підтриманих рішень (як автор і співавтор)</div></div>\n        <div class=\"stat\"><div class=\"gnum stat__num\">27 т</div><div class=\"stat__desc\">продуктів харчування у складі гуманітарної допомоги</div></div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Ремонти та благоустрій -->\n  <section class=\"section section--tint\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>Ремонти та благоустрій округу</h2></div>\n      <p class=\"report-note\">За Програмою вирішення соціально-економічних проблем та Пропозиціями до Програми економічного і соціального розвитку міста Києва.</p>\n      <ul class=\"report-list report-list--cols\">\n        <li>Капітальний ремонт покрівель — <b>8 житлових будинків</b> і <b>2 заклади освіти</b></li>\n        <li>Реконструкція пасажирських ліфтів — <b>8 будинків</b></li>\n        <li>Капітальний ремонт інженерних мереж — <b>8 будинків</b></li>\n        <li>Капітальний ремонт електромереж та електрощитових — <b>7 будинків</b></li>\n        <li>Капітальний ремонт укриттів у житлових будинках — <b>4 об’єкти</b></li>\n        <li>Заміна вікон — <b>2 житлові будинки</b> і <b>2 заклади освіти</b></li>\n        <li>Ремонт асфальту, прибудинкових територій та проїздів — <b>12 об’єктів</b></li>\n        <li>Спортивний і дитячий ігровий майданчики — <b>2 об’єкти</b></li>\n        <li>Влаштування пандуса — <b>1 об’єкт</b></li>\n        <li>Прилади обліку теплової енергії для будинків і котелень — понад <b>4,8 млн грн</b> (лічильники та обмінний фонд)</li>\n      </ul>\n    </div>\n  </section>\n\n  <!-- Вирішені звернення -->\n  <section class=\"section section--white\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>Вирішені звернення мешканців</h2></div>\n      <ul class=\"report-list\">\n        <li>Запуск 5-го котла на котельні РК «Жуляни» — <b>відновлено опалення ЖК «Медовий»</b> (вул. Кадетський Гай, 8, 10, 12).</li>\n        <li>Відновлено теплопостачання житлового будинку №1 по вул. Миколи Василенка.</li>\n        <li>Збільшено потужність електрозабезпечення будинків №10 і 12 по вул. Кадетський Гай.</li>\n        <li>Забезпечено освітлення у ІІ під’їзді біля сходів в укриття, буд. 9 по вул. М. Брайчевського.</li>\n        <li>Очищення дощової каналізації біля буд. 13 і 13-А (пров. Чугуївський) та споруд по вул. Василенка — припинено підтоплення.</li>\n        <li>Встановлено павільйон зупинки громадського транспорту на вул. О. Теліги («Бабин Яр», у бік метро «Дорогожичі»).</li>\n        <li>Сприяння у встановленні меморіальної дошки загиблому воїну Артему Соханю (вул. Вадима Гетьмана, 25).</li>\n        <li>Благоустрій біля гуртожитку на вул. Брайчевського, 7, і ремонт покриття вздовж пров. Ковальського.</li>\n        <li>Ремонт асфальту проїжджої частини й тротуару вздовж вул. О. Тихого.</li>\n        <li>Відновлено благоустрій прибудинкової території буд. 7-А на вул. Академіка Шалімова та в місцях розриття на вул. Андрія Мельника, 5/1.</li>\n      </ul>\n    </div>\n  </section>\n\n  <!-- За власний кошт -->\n  <section class=\"section section--tint\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>За власний кошт</h2></div>\n      <ul class=\"report-list report-list--cols\">\n        <li>Поручні на сходах на вул. О. Тихого, 23–25 та вул. Борщагівській, 143.</li>\n        <li>Облаштування скверу на перетині вул. Кудряшова та П. Красикова.</li>\n        <li>Частковий ремонт покрівлі над під’їздом на вул. Металістів, 13.</li>\n        <li>Косметичний ремонт квартири після протікання покрівлі (Пр-т Повітрофлотський, 43).</li>\n        <li>Обладнання для дитячого гуртка «Радіоелектронне конструювання» (вул. Курська, 15-А).</li>\n        <li>Призи для конкурсу «Інженерінг-Фест» і міських змагань з радіоконструювання.</li>\n        <li>Будматеріали для облаштування бомбосховища СЗШ «Надія».</li>\n        <li>Заміна вікон, електроосвітлення та обладнання для СЗШ «Надія» і СЗШ №74.</li>\n        <li>Ліки та засоби гігієни для міських лікарень (КМКЛ №4, пологовий будинок №5).</li>\n        <li>Дві путівки до дитячих оздоровчих таборів «Молода Гвардія» та «Синевир».</li>\n        <li>Понад <b>770 новорічних подарунків</b> дітям пільгових категорій і дітям захисників.</li>\n      </ul>\n    </div>\n  </section>\n\n  <!-- Гуманітарна допомога -->\n  <section class=\"section section--white\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>Гуманітарна допомога</h2></div>\n      <p class=\"report-note\">Мешканцям Солом’янського району та тимчасово переміщеним особам.</p>\n      <div class=\"cards-4 report-hum\">\n        <div class=\"hum-item\"><span class=\"hum-num\">1700</span>продуктових наборів</div>\n        <div class=\"hum-item\"><span class=\"hum-num\">27 т</span>продуктів харчування</div>\n        <div class=\"hum-item\"><span class=\"hum-num\">1250</span>пасок до Великодня</div>\n        <div class=\"hum-item\"><span class=\"hum-num\">6200</span>засобів особистої гігієни</div>\n        <div class=\"hum-item\"><span class=\"hum-num\">1000 кг</span>медичних засобів</div>\n        <div class=\"hum-item\"><span class=\"hum-num\">1000</span>пачок дитячого харчування</div>\n        <div class=\"hum-item\"><span class=\"hum-num\">2000</span>памперсів і засобів гігієни</div>\n        <div class=\"hum-item\"><span class=\"hum-num\">376</span>новорічних наборів для СЗШ «Надія»</div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section section--tint\">\n    <div class=\"wrap report-cta\">\n      <p>Маєте звернення чи потребуєте допомоги?</p>\n      <a class=\"btn-g btn-lg\" href=\"/#contacts\">Звернутися до депутата</a>\n    </div>\n  </section>\n</main>\n\n<div class=\"foot-line\"></div>\n<footer class=\"footer\">\n  <div class=\"wrap foot-inner\">\n    <div class=\"foot-brand\">\n      <span class=\"mono\">ЮТ</span>\n      <span class=\"foot-id\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("<br><span>Депутат Київради · округ №12</span></span>\n    </div>\n    <nav class=\"foot-links\" aria-label=\"Офіційні посилання\">\n      ")
    ;  if (s.kyivrada_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.kyivrada_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Профіль на сайті Київради</a>")
    ;  } 
    ; __append("\n      ")
    ;  if (s.facebook_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.facebook_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Facebook: Юрій Тихонович</a>")
    ;  } 
    ; __append("\n    </nav>\n    <div class=\"foot-copy\">© ")
    ; __append(escapeFn( new Date().getFullYear() ))
    ; __append(". Усі права захищені.</div>\n  </div>\n</footer>\n\n<script src=\"/js/main.js\"></script>\n</body>\n</html>\n")
  return __output;

},
  "army": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
s = __locals.s,
  news = __locals.news,
  achievements = __locals.achievements,
  post = __locals.post,
  bodyHtml = __locals.bodyHtml,
  extraImages = __locals.extraImages,
  username = __locals.username,
  error = __locals.error,
  esc = __locals.esc,
  nl2br = __locals.nl2br,
  paragraphs = __locals.paragraphs,
  stripPhotoTokens = __locals.stripPhotoTokens;
    ; __append("<!DOCTYPE html>\n<html lang=\"uk\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Підтримка Захисників 2022–2025 — ")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</title>\n  <meta name=\"description\" content=\"Хронологія допомоги Силам оборони від Юрія Тихоновича у 2022–2025 роках: дрони, РЕБ, автомобілі, генератори, спорядження для бригад ТрО, ЗСУ, ГУР та СБУ.\" />\n  <meta property=\"og:title\" content=\"Підтримка Захисників 2022–2025 — ")
    ; __append(escapeFn( s.hero_name ))
    ; __append("\" />\n  <meta property=\"og:image\" content=\"")
    ; __append(escapeFn( s.og_image ))
    ; __append("\" />\n\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link rel=\"preconnect\" href=\"https://cdn.jsdelivr.net\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"/css/style.css\" />\n</head>\n<body>\n\n<div id=\"pbar\"></div>\n\n<nav id=\"siteNav\" class=\"nav\" aria-label=\"Головна навігація\">\n  <a class=\"nav__brand\" href=\"/\" aria-label=\"На головну\">\n    <span class=\"mono\">ЮТ</span>\n    <span class=\"nav__id\">\n      <span class=\"nav__name\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("</span>\n      <span class=\"nav__role\">Депутат Київради · округ №12</span>\n    </span>\n  </a>\n  <div class=\"nav__links\" id=\"navLinks\">\n    <a href=\"/#about\" class=\"nl\">Про депутата</a>\n    <a href=\"/#activity\" class=\"nl\">Діяльність</a>\n    <a href=\"/#results\" class=\"nl\">Досягнення</a>\n    <a href=\"/#army\" class=\"nl\">Захисникам</a>\n    <a href=\"/#news\" class=\"nl\">Новини</a>\n    <a href=\"/#contacts\" class=\"nl\">Контакти</a>\n  </div>\n  <a href=\"/#contacts\" class=\"btn-g nav__cta\">Звернутися</a>\n  <button class=\"nav-toggle\" id=\"navToggle\" aria-label=\"Меню\" aria-expanded=\"false\">\n    <span></span><span></span><span></span>\n  </button>\n</nav>\n\n<main class=\"report\">\n  <header class=\"section section--tint report-hero\">\n    <div class=\"wrap\">\n      <a class=\"gallery-back\" href=\"/#army\">← На головну</a>\n      <div class=\"eyebrow\"><span class=\"eyebrow__line\"></span>2022 — 2025</div>\n      <h1 class=\"gtext report-hero__title\">Підтримка Захисників</h1>\n      <p class=\"lead\">Від перших днів повномасштабного вторгнення — системна допомога Силам оборони: ударні та розвідувальні дрони, засоби РЕБ, автомобілі, генератори, спорядження й гуманітарка. Нижче — хронологія за роками (за офіційними звітами депутата).</p>\n    </div>\n  </header>\n\n  <!-- 2022 -->\n  <section class=\"section section--white\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>2022 — оборона Києва й перші поставки</h2></div>\n      <p class=\"report-note\">З 17 березня 2022 року — у складі добровольчого формування ТрО Києва №18 «Молот». Три гуманітарні поїздки на фронт (Харківщина).</p>\n      <ul class=\"report-list report-list--cols\">\n        <li><b>Транспорт:</b> автомобілі Mercedes Vito, Peugeot і вантажний (спільно з КНУБА) — для ТрО та ЗСУ.</li>\n        <li><b>Дрони й оптика:</b> 5 квадрокоптерів DJI Mavic 3; 8 тепловізійних і снайперських прицілів (Pulsar Trail, Zeiss).</li>\n        <li><b>Спорядження:</b> 4 генератори, 50 бронежилетів, 100 касок, 20 тактичних шоломів, 50 біноклів, 10 міношукачів, 50 перископів, 12 польових печей, планшети, повербанки, бензопили.</li>\n        <li><b>Медицина й побут:</b> аптечки та ліки, 300 турнікетів, 50 маскувальних сіток, спальники, 8000 засобів гігієни, паливо.</li>\n        <li><b>Продовольство:</b> 30 тонн продуктів і 7 тонн хліба — киянам і бійцям під час боїв за Київ.</li>\n        <li><b>Відзнаки:</b> подяки від 241-ї бригади ТрО, 130-го та 204-го батальйонів ТрО, ДФ «Молот», військової частини А7373.</li>\n      </ul>\n      <div class=\"report-photos\">\n        <figure><img src=\"/img/army/2022-1.jpg\" alt=\"Допомога Захисникам, 2022\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2022-2.jpg\" alt=\"Допомога Захисникам, 2022\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2022-3.jpg\" alt=\"Допомога Захисникам, 2022\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2022-4.jpg\" alt=\"Допомога Захисникам, 2022\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2022-5.jpg\" alt=\"Допомога Захисникам, 2022\" loading=\"lazy\"></figure>\n      </div>\n    </div>\n  </section>\n\n  <!-- 2023 -->\n  <section class=\"section section--tint\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>2023 — дрони, РЕБ і техніка на фронт</h2></div>\n      <ul class=\"report-list report-list--cols\">\n        <li><b>Ударні FPV-дрони-камікадзе</b> — кількома партіями (зокрема 40 шт; 20 шт для 92-ї бригади; 10 шт із РЕБ «Купол»; для спецпідрозділу «Котики» 130-го об-ТрО; для 128-го батальйону) з наземними станціями керування.</li>\n        <li><b>Розвідувальні дрони:</b> DJI Mavic 3T (тепловізійні) для 204-го об-ТрО (напрямок Бахмута), DJI Mavic 3E.</li>\n        <li><b>Ударний безпілотник «Vampire»</b> з тепловізором.</li>\n        <li><b>Автомобілі</b> (повнопривідні) — 112-й окремій бригаді ТрО, 243-му об-ТрО, 128-му батальйону.</li>\n        <li><b>Зв’язок і живлення:</b> Starlink, LED-освітлення.</li>\n        <li><b>Медицина:</b> допомога пораненим у міській лікарні; термоковдри, ліки, напої — 204-му батальйону.</li>\n        <li><b>Мобільний лазне-пральний комплекс (МЛПК)</b> для сил ТрО: генератор, баки для води, пральні та сушильні машини.</li>\n        <li><b>Маскувальні сітки</b> — зокрема 243-й мінометній батареї.</li>\n      </ul>\n      <div class=\"report-photos\">\n        <figure><img src=\"/img/army/2023-1.jpg\" alt=\"Допомога Захисникам, 2023\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2023-2.jpg\" alt=\"Допомога Захисникам, 2023\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2023-3.jpg\" alt=\"Допомога Захисникам, 2023\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2023-4.jpg\" alt=\"Допомога Захисникам, 2023\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2023-5.jpg\" alt=\"Допомога Захисникам, 2023\" loading=\"lazy\"></figure>\n      </div>\n    </div>\n  </section>\n\n  <!-- 2024 -->\n  <section class=\"section section--white\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>2024 — 24 виїзди на фронт</h2></div>\n      <ul class=\"report-list report-list--cols\">\n        <li><b>Автотранспорт:</b> автомобіль і швидка для Головного військового клінічного госпіталю; ГАЗ-66 для 204-го батальйону; авто для 92-ї ОШБр (Харківщина) та інших підрозділів.</li>\n        <li><b>Інженерна техніка:</b> екскаватор-навантажувач JCB 3CX для фортифікаційних споруд.</li>\n        <li><b>Ударні дрони:</b> партії FPV-камікадзе (50 шт та інші) з акумуляторами 8000 mAh.</li>\n        <li><b>Розвідувальні дрони:</b> DJI Mavic 3E / 3 PRO (204-й ОБТрО), DJI Matrice 30 (128-й батальйон), потужний DJI Matrice 350 RTK з тепловізором (ЦСО «А» СБУ), комплекси БпЛА (117-та бригада), «Vampire» (130-й батальйон).</li>\n        <li><b>РЕБ:</b> 4-діапазонні станції «Купол» та інші — східний фронт, взвод снайперів, 44-й стрілецький батальйон (з ретранслятором і монітором FPV), «Ахіллес» 92-ї ОШБр.</li>\n        <li><b>Забезпечення операторів:</b> ноутбуки й зарядні станції (117-та бригада), телевізори для штабів/аеророзвідки, окопні свічки та грілки (116-та бригада).</li>\n      </ul>\n      <p class=\"report-note\">Підрозділи, яким передавалася допомога у 2024-му: 23-й, 44-й, 92-й, 101-й, 116-й, 117-й, 128-й, 130-й, 204-й та ЦСО «А» СБУ.</p>\n      <div class=\"report-photos\">\n        <figure><img src=\"/img/army/2024-1.jpg\" alt=\"Допомога Захисникам, 2024\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2024-2.jpg\" alt=\"Допомога Захисникам, 2024\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2024-3.jpg\" alt=\"Допомога Захисникам, 2024\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2024-4.jpg\" alt=\"Допомога Захисникам, 2024\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2024-5.jpg\" alt=\"Допомога Захисникам, 2024\" loading=\"lazy\"></figure>\n      </div>\n    </div>\n  </section>\n\n  <!-- 2025 -->\n  <section class=\"section section--tint\">\n    <div class=\"wrap\">\n      <div class=\"sec-head\"><span class=\"sec-bar\"></span><h2>2025 — щомісячні поставки</h2></div>\n      <ul class=\"report-list report-list--cols\">\n        <li><b>Січень:</b> FPV-дрони та Mavic 3 Pro.</li>\n        <li><b>Лютий:</b> засоби РЕБ, планшети, EcoFlow; ударні FPV-дрони.</li>\n        <li><b>Березень:</b> дрони та РЕБ для 92-ї ОШБр ім. Івана Сірка; EcoFlow і планшети.</li>\n        <li><b>Квітень:</b> Mavic 3T, дрони на оптоволокні та планшети для 92-ї бригади.</li>\n        <li><b>Травень:</b> Starlink для 429-го полку безпілотних систем «Ахіллес».</li>\n        <li><b>Червень:</b> антитепловізійні костюми для підрозділу снайперів.</li>\n        <li><b>Липень:</b> повнопривідний автомобіль для 92-ї ОШБр ім. Івана Сірка.</li>\n        <li><b>Серпень:</b> авто-Starlink для «Ахіллеса»; щогли й генератор для 241-ї бригади ТрО.</li>\n        <li><b>Грудень:</b> автомобіль для підрозділу розвідки.</li>\n      </ul>\n      <div class=\"report-photos\">\n        <figure><img src=\"/img/army/2025-1.jpg\" alt=\"Допомога Захисникам, 2025\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2025-2.jpg\" alt=\"Допомога Захисникам, 2025\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2025-3.jpg\" alt=\"Допомога Захисникам, 2025\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2025-4.jpg\" alt=\"Допомога Захисникам, 2025\" loading=\"lazy\"></figure>\n        <figure><img src=\"/img/army/2025-5.jpg\" alt=\"Допомога Захисникам, 2025\" loading=\"lazy\"></figure>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section section--white\">\n    <div class=\"wrap report-cta\">\n      <p>Долучитися до підтримки або звернутися до депутата</p>\n      <a class=\"btn-g btn-lg\" href=\"/#contacts\">Звернутися</a>\n    </div>\n  </section>\n</main>\n\n<div class=\"foot-line\"></div>\n<footer class=\"footer\">\n  <div class=\"wrap foot-inner\">\n    <div class=\"foot-brand\">\n      <span class=\"mono\">ЮТ</span>\n      <span class=\"foot-id\">")
    ; __append(escapeFn( s.hero_name ))
    ; __append("<br><span>Депутат Київради · округ №12</span></span>\n    </div>\n    <nav class=\"foot-links\" aria-label=\"Офіційні посилання\">\n      ")
    ;  if (s.kyivrada_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.kyivrada_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Профіль на сайті Київради</a>")
    ;  } 
    ; __append("\n      ")
    ;  if (s.facebook_url) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( s.facebook_url ))
    ; __append("\" target=\"_blank\" rel=\"noopener\">Facebook: Юрій Тихонович</a>")
    ;  } 
    ; __append("\n    </nav>\n    <div class=\"foot-copy\">© ")
    ; __append(escapeFn( new Date().getFullYear() ))
    ; __append(". Усі права захищені.</div>\n  </div>\n</footer>\n\n<script src=\"/js/main.js\"></script>\n</body>\n</html>\n")
  return __output;

},
  "manager/login": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
s = __locals.s,
  news = __locals.news,
  achievements = __locals.achievements,
  post = __locals.post,
  bodyHtml = __locals.bodyHtml,
  extraImages = __locals.extraImages,
  username = __locals.username,
  error = __locals.error,
  esc = __locals.esc,
  nl2br = __locals.nl2br,
  paragraphs = __locals.paragraphs,
  stripPhotoTokens = __locals.stripPhotoTokens;
    ; __append("<!DOCTYPE html>\n<html lang=\"uk\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta name=\"robots\" content=\"noindex, nofollow\" />\n  <title>Вхід — Адмінпанель</title>\n  <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"/css/admin.css\" />\n</head>\n<body class=\"login-page\">\n  <form class=\"login-card\" method=\"POST\" action=\"/manager/login\" autocomplete=\"on\">\n    <h1>Адмінпанель</h1>\n    <p class=\"login-sub\">Вхід для контент-редактора</p>\n\n    ")
    ;  if (error) { 
    ; __append("<div class=\"alert alert--error\">")
    ; __append(escapeFn( error ))
    ; __append("</div>")
    ;  } 
    ; __append("\n\n    <label>Логін\n      <input type=\"text\" name=\"username\" required autofocus autocomplete=\"username\" />\n    </label>\n    <label>Пароль\n      <input type=\"password\" name=\"password\" required autocomplete=\"current-password\" />\n    </label>\n    <button type=\"submit\" class=\"btn btn--accent btn--block\">Увійти</button>\n    <a class=\"back-link\" href=\"/\">← На сайт</a>\n  </form>\n</body>\n</html>\n")
  return __output;

},
  "manager/dashboard": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
s = __locals.s,
  news = __locals.news,
  achievements = __locals.achievements,
  post = __locals.post,
  bodyHtml = __locals.bodyHtml,
  extraImages = __locals.extraImages,
  username = __locals.username,
  error = __locals.error,
  esc = __locals.esc,
  nl2br = __locals.nl2br,
  paragraphs = __locals.paragraphs,
  stripPhotoTokens = __locals.stripPhotoTokens;
    ; __append("<!DOCTYPE html>\n<html lang=\"uk\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta name=\"robots\" content=\"noindex, nofollow\" />\n  <title>Адмінпанель</title>\n  <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"/css/admin.css\" />\n</head>\n<body class=\"admin\">\n\n<header class=\"admin-top\">\n  <div class=\"admin-top__inner\">\n    <strong>Адмінпанель</strong>\n    <div class=\"admin-top__right\">\n      <a href=\"/\" target=\"_blank\" rel=\"noopener\">Відкрити сайт ↗</a>\n      <span class=\"user\">👤 ")
    ; __append(escapeFn( username ))
    ; __append("</span>\n      <form method=\"POST\" action=\"/manager/logout\" style=\"display:inline\">\n        <button class=\"btn btn--sm\">Вийти</button>\n      </form>\n    </div>\n  </div>\n</header>\n\n<div class=\"admin-layout\">\n  <!-- Вкладки -->\n  <nav class=\"admin-tabs\" id=\"tabs\">\n    <button class=\"tab is-active\" data-tab=\"news\">📰 Новини</button>\n    <button class=\"tab\" data-tab=\"gallery\">🖼️ Галерея</button>\n    <button class=\"tab\" data-tab=\"texts\">✏️ Тексти секцій</button>\n    <button class=\"tab\" data-tab=\"achievements\">🏅 Досягнення</button>\n    <button class=\"tab\" data-tab=\"contacts\">📞 Контакти</button>\n    <button class=\"tab\" data-tab=\"media\">🎯 Фото / логотип</button>\n    <button class=\"tab\" data-tab=\"submissions\">✉️ Звернення</button>\n  </nav>\n\n  <main class=\"admin-main\">\n    <div id=\"toast\" class=\"toast\" role=\"status\" aria-live=\"polite\"></div>\n\n    <!-- ─── Новини ─── -->\n    <section class=\"panel is-active\" data-panel=\"news\">\n      <div class=\"panel__head\">\n        <h2>Новини</h2>\n        <button class=\"btn btn--accent\" id=\"newsNewBtn\">+ Нова новина</button>\n      </div>\n      <div class=\"info-box\">\n        <strong>📷 Як вставити фото в текст новини</strong>\n        <ol>\n          <li>Завантажте знімки в полі <b>«Додаткові фото»</b>.</li>\n          <li>У полі <b>«Текст»</b> напишіть <code>[фото1]</code>, <code>[фото2]</code> … <b>окремим рядком</b> (з порожнім рядком до і після) там, де має бути знімок.</li>\n          <li>Номер = порядок «Додаткових фото» (при редагуванні номер видно під кожним фото).</li>\n          <li>Фото без маркера автоматично покажуться галереєю внизу новини.</li>\n        </ol>\n      </div>\n      <div id=\"newsList\" class=\"list\"></div>\n\n      <!-- Форма новини (прихована, показується при створенні/редагуванні) -->\n      <dialog id=\"newsDialog\" class=\"dialog\">\n        <form id=\"newsForm\" method=\"dialog\">\n          <h3 id=\"newsFormTitle\">Нова новина</h3>\n          <input type=\"hidden\" name=\"id\" />\n          <label>Заголовок*<input type=\"text\" name=\"title\" required maxlength=\"200\" /></label>\n          <div class=\"row\">\n            <label>Дата*<input type=\"date\" name=\"date\" required /></label>\n            <label>Тег<input type=\"text\" name=\"tag\" maxlength=\"60\" placeholder=\"напр. ЖКГ\" /></label>\n          </div>\n          <label>Текст<textarea name=\"body\" rows=\"8\"></textarea></label>\n          <p class=\"hint\">📷 Щоб вставити фото <b>всередину тексту</b> — напишіть <b>[фото1]</b>, <b>[фото2]</b> тощо <b>окремим рядком</b> (з порожнім рядком до і після) там, де хочете бачити знімок. Номер відповідає порядку «Додаткових фото» нижче. Фото без маркера покажуться галереєю внизу новини.</p>\n          <label>Статус\n            <select name=\"status\">\n              <option value=\"draft\">Чернетка</option>\n              <option value=\"published\">Опубліковано</option>\n            </select>\n          </label>\n          <label>Головне фото<input type=\"file\" name=\"cover\" accept=\"image/*\" /></label>\n          <div id=\"newsCoverPreview\" class=\"preview-row\"></div>\n          <label>Додаткові фото (до поста)<input type=\"file\" name=\"images\" accept=\"image/*\" multiple /></label>\n          <div id=\"newsImagesPreview\" class=\"preview-row\"></div>\n          <div class=\"dialog__actions\">\n            <button type=\"button\" class=\"btn\" data-close>Скасувати</button>\n            <button type=\"submit\" class=\"btn btn--accent\">Зберегти</button>\n          </div>\n        </form>\n      </dialog>\n    </section>\n\n    <!-- ─── Галерея ─── -->\n    <section class=\"panel\" data-panel=\"gallery\">\n      <div class=\"panel__head\">\n        <h2>Фотогалерея</h2>\n        <form id=\"galleryUploadForm\" class=\"inline-upload\">\n          <input type=\"file\" name=\"images\" accept=\"image/*\" multiple required />\n          <button class=\"btn btn--accent\" type=\"submit\">Завантажити</button>\n        </form>\n      </div>\n      <p class=\"hint\">Перетягуйте картки, щоб змінити порядок. Підпис зберігається автоматично.</p>\n      <div id=\"galleryGrid\" class=\"admin-gallery\"></div>\n    </section>\n\n    <!-- ─── Тексти секцій ─── -->\n    <section class=\"panel\" data-panel=\"texts\">\n      <div class=\"panel__head\"><h2>Тексти секцій</h2></div>\n      <form id=\"textsForm\" class=\"settings-form\">\n        <label>Гасло (Hero)<input type=\"text\" data-key=\"hero_slogan\" /></label>\n        <label>Фракція<input type=\"text\" data-key=\"hero_faction\" /></label>\n        <label>Роль 1<input type=\"text\" data-key=\"hero_role1\" /></label>\n        <label>Роль 2<input type=\"text\" data-key=\"hero_role2\" /></label>\n        <label>Біографія<textarea data-key=\"bio\" rows=\"5\"></textarea></label>\n        <label>Освіта<textarea data-key=\"education\" rows=\"3\"></textarea></label>\n        <label>Професійний шлях<textarea data-key=\"career\" rows=\"4\"></textarea></label>\n        <label>Округ<input type=\"text\" data-key=\"activity_district\" /></label>\n        <label>Посада в комісії<input type=\"text\" data-key=\"activity_position\" /></label>\n        <label>Опис діяльності<textarea data-key=\"activity_intro\" rows=\"3\"></textarea></label>\n        <label>Зона відповідальності (Київміськбуд)<input type=\"text\" data-key=\"board_zone\" /></label>\n        <hr />\n        <label>SEO title<input type=\"text\" data-key=\"meta_title\" /></label>\n        <label>SEO description<textarea data-key=\"meta_description\" rows=\"2\"></textarea></label>\n        <button class=\"btn btn--accent\" type=\"submit\">Зберегти тексти</button>\n      </form>\n    </section>\n\n    <!-- ─── Досягнення ─── -->\n    <section class=\"panel\" data-panel=\"achievements\">\n      <div class=\"panel__head\">\n        <h2>Досягнення (картки)</h2>\n        <button class=\"btn btn--accent\" id=\"achNewBtn\">+ Нова картка</button>\n      </div>\n      <p class=\"hint\">Перетягуйте картки, щоб змінити порядок.</p>\n      <div id=\"achList\" class=\"ach-list\"></div>\n    </section>\n\n    <!-- ─── Контакти ─── -->\n    <section class=\"panel\" data-panel=\"contacts\">\n      <div class=\"panel__head\"><h2>Контакти</h2></div>\n      <form id=\"contactsForm\" class=\"settings-form\">\n        <label>Адреса<input type=\"text\" data-key=\"contact_address\" /></label>\n        <label>Телефони<input type=\"text\" data-key=\"contact_phones\" /></label>\n        <label>Примітка до телефонів<input type=\"text\" data-key=\"contact_phones_note\" /></label>\n        <label>Email<input type=\"text\" data-key=\"contact_email\" /></label>\n        <label>Графік прийому<input type=\"text\" data-key=\"contact_hours\" /></label>\n        <label>Facebook<input type=\"text\" data-key=\"facebook_url\" /></label>\n        <label>Посилання на Київраду<input type=\"text\" data-key=\"kyivrada_url\" /></label>\n        <label>Код карти (HTML &lt;iframe&gt; Google Maps)<textarea data-key=\"map_embed\" rows=\"3\"></textarea></label>\n        <button class=\"btn btn--accent\" type=\"submit\">Зберегти контакти</button>\n      </form>\n    </section>\n\n    <!-- ─── Фото / логотип ─── -->\n    <section class=\"panel\" data-panel=\"media\">\n      <div class=\"panel__head\"><h2>Головне фото та логотип</h2></div>\n      <div class=\"media-grid\">\n        <div class=\"media-box\">\n          <h3>Головне фото депутата</h3>\n          <img id=\"heroPhotoPreview\" class=\"media-preview\" alt=\"Головне фото\" />\n          <input type=\"file\" id=\"heroPhotoInput\" accept=\"image/*\" />\n          <p class=\"hint\">Зображення оновиться одразу після вибору файлу.</p>\n        </div>\n        <div class=\"media-box\">\n          <h3>Логотип</h3>\n          <img id=\"logoPreview\" class=\"media-preview media-preview--logo\" alt=\"Логотип\" />\n          <input type=\"file\" id=\"logoInput\" accept=\"image/*\" />\n        </div>\n        <div class=\"media-box\">\n          <h3>OpenGraph-зображення (для соцмереж)</h3>\n          <img id=\"ogPreview\" class=\"media-preview\" alt=\"OG image\" />\n          <input type=\"file\" id=\"ogInput\" accept=\"image/*\" />\n        </div>\n      </div>\n    </section>\n\n    <!-- ─── Звернення ─── -->\n    <section class=\"panel\" data-panel=\"submissions\">\n      <div class=\"panel__head\"><h2>Звернення з форми</h2></div>\n      <div id=\"subsList\" class=\"subs\"></div>\n    </section>\n  </main>\n</div>\n\n<!-- Форма-діалог досягнення -->\n<dialog id=\"achDialog\" class=\"dialog\">\n  <form id=\"achForm\" method=\"dialog\">\n    <h3 id=\"achFormTitle\">Нова картка</h3>\n    <input type=\"hidden\" name=\"id\" />\n    <label>Назва*<input type=\"text\" name=\"title\" required maxlength=\"120\" /></label>\n    <label>Опис<textarea name=\"body\" rows=\"4\"></textarea></label>\n    <div class=\"dialog__actions\">\n      <button type=\"button\" class=\"btn\" data-close>Скасувати</button>\n      <button type=\"submit\" class=\"btn btn--accent\">Зберегти</button>\n    </div>\n  </form>\n</dialog>\n\n<script src=\"/js/admin.js\"></script>\n</body>\n</html>\n")
  return __output;

},
};

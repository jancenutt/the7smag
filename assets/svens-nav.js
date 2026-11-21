// The Svens — story navigation arrows + live date guard.
// Added to the Muze copy, 2026-11-21. The live Kimi site is untouched.
//
// STORY NUMBERING: stories are numbered 01, 02, 03... in the order they
// were posted, up to 100+. When a new story is posted, add its article
// path to the end of STORIES below and give it the next number in the
// site data (folio + numeral fields in the bundle).
(function () {
  "use strict";

  var STORIES = [
    "/article/nobody-gets-good-in-clean-clothes", // 01
    "/article/on-gods-timing-field-guide",        // 02
    "/article/the-coin-an-object-history",        // 03
    "/article/two-intelligences-one-love-story",  // 04
    "/article/the-archive-speaks"                 // 05
  ];

  // --- Styles: black caret arrows, newspaper-reader style ---
  var css = [
    ".svens-nav-btn{",
    "  position:fixed; top:50%; z-index:9999;",
    "  width:56px; height:56px; margin-top:-28px;",
    "  display:flex; align-items:center; justify-content:center;",
    "  background:#fff; color:#000;",
    "  border:1.5px solid #000; border-radius:50%;",
    "  font-family:Georgia,'Times New Roman',serif;",
    "  font-size:34px; line-height:1; font-weight:700;",
    "  cursor:pointer; user-select:none; -webkit-user-select:none;",
    "  box-shadow:0 2px 10px rgba(0,0,0,.25);",
    "  transition:transform .15s ease, background .15s ease;",
    "  padding:0 0 4px 0;",
    "}",
    ".svens-nav-btn:hover{ transform:scale(1.08); background:#f2f2f2; }",
    ".svens-nav-btn:active{ transform:scale(.96); }",
    ".svens-nav-btn:focus-visible{ outline:2px solid #000; outline-offset:2px; }",
    "#svens-nav-prev{ left:14px; }",
    "#svens-nav-next{ right:14px; }",
    ".svens-nav-hidden{ display:none !important; }",
    "@media (max-width:640px){",
    "  .svens-nav-btn{ width:44px; height:44px; margin-top:-22px; font-size:26px; }",
    "  #svens-nav-prev{ left:8px; }",
    "  #svens-nav-next{ right:8px; }",
    "}"
  ].join("\n");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // --- Buttons (live outside React's root, so re-renders never touch them) ---
  function makeButton(id, label, glyph) {
    var b = document.createElement("button");
    b.id = id;
    b.className = "svens-nav-btn svens-nav-hidden";
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.title = label;
    b.textContent = glyph;
    document.body.appendChild(b);
    return b;
  }
  var prevBtn = makeButton("svens-nav-prev", "Previous story", "\u2039");
  var nextBtn = makeButton("svens-nav-next", "Next story", "\u203a");

  // --- Navigation: SPA-style, no page reload (direct article URLs 404) ---
  function go(path) {
    if (!path || path === window.location.pathname) return;
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo(0, 0);
    update();
  }

  function currentIndex() {
    return STORIES.indexOf(window.location.pathname);
  }

  function update() {
    var path = window.location.pathname;
    var idx = currentIndex();
    var onIssue = path === "/issue" || path === "/issue/";
    var onArticle = idx !== -1;
    if (!onIssue && !onArticle) {
      prevBtn.classList.add("svens-nav-hidden");
      nextBtn.classList.add("svens-nav-hidden");
      return;
    }
    // Prev: hidden on the Issue page and on story 01.
    var prevTarget = onArticle && idx > 0 ? STORIES[idx - 1] : null;
    // Next: from the Issue page, start at story 01; from a story, go on.
    var nextTarget = onIssue ? STORIES[0]
      : (onArticle && idx < STORIES.length - 1 ? STORIES[idx + 1] : null);
    prevBtn.classList.toggle("svens-nav-hidden", !prevTarget);
    nextBtn.classList.toggle("svens-nav-hidden", !nextTarget);
    prevBtn.onclick = prevTarget ? function () { go(prevTarget); } : null;
    nextBtn.onclick = nextTarget ? function () { go(nextTarget); } : null;
  }

  // --- Keep the arrows in sync with the router ---
  var _pushState = history.pushState;
  var _replaceState = history.replaceState;
  history.pushState = function () {
    var r = _pushState.apply(this, arguments);
    update();
    return r;
  };
  history.replaceState = function () {
    var r = _replaceState.apply(this, arguments);
    update();
    return r;
  };
  window.addEventListener("popstate", update);
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" && !prevBtn.classList.contains("svens-nav-hidden")) {
      prevBtn.click();
    } else if (e.key === "ArrowRight" && !nextBtn.classList.contains("svens-nav-hidden")) {
      nextBtn.click();
    }
  });

  update();
})();

// The Svens — page tabs under the masthead.
// Added 2026-11-24 at J'ance's direction: little tabs all the way across
// under "The Svens" on the main page, one tab per portfolio page, in his
// order: Sportsbook, J'ance Nutt, Suki Shinoda, Ana.Luci, JJ&CO TRUST BRAND.
// Lives outside the React bundle (same pattern as svens-nav.js): finds the
// masthead heading, then inserts the tab bar right under its header block.
(function () {
  "use strict";

  var TABS = [
    { label: "Sportsbook", href: "/sportsbook/" },
    { label: "J'ance Nutt", href: "/jancenutt/" },
    { label: "Suki Shinoda", href: "/suki/" },
    { label: "Ana.Luci", href: "/analuci/" },
    { label: "JJ&CO TRUST BRAND", href: "/jjncotrustbrand/" }
  ];

  var css = [
    ".svens-tabs{",
    "  display:flex; flex-wrap:nowrap; width:100%;",
    "  border-top:3px double #111; border-bottom:1.5px solid #111;",
    "  background:#fbfaf7; margin:0; padding:0;",
    "  font-family:'Libre Franklin', Arial, sans-serif;",
    "  position:relative; z-index:60;",
    "}",
    ".svens-tabs a{",
    "  flex:1 1 0; text-align:center; padding:10px 4px;",
    "  color:#111; text-decoration:none;",
    "  font-size:13px; font-weight:600;",
    "  letter-spacing:.12em; text-transform:uppercase;",
    "  border-right:1px solid #ccc; white-space:nowrap;",
    "  overflow:hidden; text-overflow:ellipsis;",
    "}",
    ".svens-tabs a:last-child{ border-right:none; }",
    ".svens-tabs a:hover{ background:#111; color:#fff; }",
    "@media (max-width:640px){",
    "  .svens-tabs a{ font-size:10px; letter-spacing:.05em; padding:8px 2px; }",
    "}"
  ].join("\n");

  function buildBar() {
    var bar = document.createElement("nav");
    bar.className = "svens-tabs";
    bar.setAttribute("aria-label", "The Svens pages");
    TABS.forEach(function (t) {
      var a = document.createElement("a");
      a.href = t.href;
      a.textContent = t.label;
      bar.appendChild(a);
    });
    return bar;
  }

  function findMastheadBlock() {
    // The masthead is the big "The Svens" heading. Walk up to the block
    // that wraps it (header or a full-width div) and put the bar after it.
    var nodes = document.querySelectorAll("h1, h2, header div, a");
    var best = null;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.textContent && el.textContent.trim() === "The Svens") {
        best = el;
        break;
      }
    }
    if (!best) return null;
    var block = best;
    while (
      block.parentElement &&
      block.parentElement !== document.body &&
      block.parentElement.id !== "root" &&
      block.parentElement.children.length <= 3
    ) {
      block = block.parentElement;
    }
    return block;
  }

  function inject() {
    if (document.querySelector(".svens-tabs")) return true;
    var block = findMastheadBlock();
    if (!block || !block.parentElement) return false;
    if (!document.getElementById("svens-tabs-style")) {
      var style = document.createElement("style");
      style.id = "svens-tabs-style";
      style.textContent = css;
      document.head.appendChild(style);
    }
    block.parentElement.insertBefore(buildBar(), block.nextSibling);
    return true;
  }

  // React renders after load; retry for a few seconds, then watch for
  // route changes (hash routing re-renders the header).
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (inject() || tries > 40) clearInterval(timer);
  }, 250);

  var observer = new MutationObserver(function () {
    inject();
  });
  window.addEventListener("hashchange", function () {
    setTimeout(inject, 300);
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 15000);
  }
})();

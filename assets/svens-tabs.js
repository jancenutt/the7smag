// The Svens — page tabs under the masthead.
// Added 2026-11-24 at J'ance's direction: little tabs all the way across
// under "The Svens" on the main page, one tab per portfolio page, in his
// order, ALL CAPS: SPORTSBOOK, J'ANCE NUTT, SUKI SHINODA, ANA.LUCI,
// JJ&CO TRUST BRAND. One line across on mobile too — no stacking.
// Lives outside the React bundle (same pattern as svens-nav.js).
// Placement fix (2026-11-24): the masthead is the LARGEST "The Svens"
// heading near the TOP of the page — a footer/colophon "The Svens" must
// never win, or the bar lands at the bottom.
(function () {
  "use strict";

  var TABS = [
    { label: "SPORTSBOOK", href: "/sportsbook/" },
    { label: "J'ANCE NUTT", href: "/jancenutt/" },
    { label: "SUKI SHINODA", href: "/suki/" },
    { label: "ANA.LUCI", href: "/analuci/" },
    { label: "JJ&CO TRUST BRAND", href: "/jjncotrustbrand/" }
  ];

  var css = [
    ".svens-tabs{",
    "  display:flex; flex-wrap:nowrap; width:100%; box-sizing:border-box;",
    "  border-top:3px double #111; border-bottom:1.5px solid #111;",
    "  background:#fbfaf7; margin:0; padding:0;",
    "  font-family:'Libre Franklin', Arial, sans-serif;",
    "  position:relative; z-index:60;",
    "}",
    ".svens-tabs a{",
    "  flex:1 1 0; min-width:0; text-align:center; padding:10px 2px;",
    "  color:#111; text-decoration:none;",
    "  font-size:13px; font-weight:600;",
    "  letter-spacing:.1em; text-transform:uppercase;",
    "  border-right:1px solid #ccc; white-space:nowrap;",
    "}",
    ".svens-tabs a:last-child{ border-right:none; }",
    ".svens-tabs a:hover{ background:#111; color:#fff; }",
    "@media (max-width:640px){",
    "  .svens-tabs a{ font-size:clamp(7px, 2vw, 10px); letter-spacing:0; padding:8px 0; }",
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
    var nodes = document.querySelectorAll("h1, h2, h3, header *, a, div, span");
    var best = null, bestScore = -1;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el.textContent || el.textContent.trim() !== "The Svens") continue;
      if (el.children.length > 0) continue; // the heading itself, not a wrapper
      var rect = el.getBoundingClientRect();
      var top = rect.top + window.scrollY;
      if (top > 900) continue; // footer/colophon copies sit far down the page
      var size = parseFloat(window.getComputedStyle(el).fontSize) || 0;
      var score = size * 1000 - top;
      if (score > bestScore) { bestScore = score; best = el; }
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

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (inject() || tries > 40) clearInterval(timer);
  }, 250);

  var observer = new MutationObserver(function () { inject(); });
  window.addEventListener("hashchange", function () {
    setTimeout(inject, 300);
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 15000);
  }
})();

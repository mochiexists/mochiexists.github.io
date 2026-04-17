(function () {
  'use strict';

  const RADIUS = 120;
  const MAX_DISPLACEMENT = 14;
  const RETURN_MS = 400;

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFineHover =
    window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (prefersReducedMotion || !hasFineHover) return;

  function enhance(h1) {
    const text = h1.textContent;
    h1.setAttribute('aria-label', text);
    h1.textContent = '';

    const letters = [];
    for (const ch of text) {
      if (ch === ' ') {
        h1.appendChild(document.createTextNode(' '));
        continue;
      }
      const span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = ch;
      span.style.willChange = 'transform';
      span.style.transition = 'transform ' + RETURN_MS + 'ms cubic-bezier(0.22, 1, 0.36, 1)';
      h1.appendChild(span);
      letters.push(span);
    }
    return letters;
  }

  const allLetters = [];
  document.querySelectorAll('h1.repel').forEach((h1) => {
    allLetters.push(...enhance(h1));
  });

  if (!allLetters.length) return;

  let cursorX = -9999;
  let cursorY = -9999;
  let rafPending = false;

  function update() {
    rafPending = false;
    for (const span of allLetters) {
      const rect = span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - cursorX;
      const dy = cy - cursorY;
      const dist = Math.hypot(dx, dy);

      if (dist >= RADIUS || dist === 0) {
        span.style.transform = '';
        continue;
      }
      const falloff = 1 - dist / RADIUS;
      const magnitude = MAX_DISPLACEMENT * falloff;
      const tx = (dx / dist) * magnitude;
      const ty = (dy / dist) * magnitude;
      span.style.transform = 'translate(' + tx.toFixed(2) + 'px, ' + ty.toFixed(2) + 'px)';
    }
  }

  function scheduleUpdate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(update);
  }

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    scheduleUpdate();
  });

  document.addEventListener('mouseleave', () => {
    cursorX = -9999;
    cursorY = -9999;
    scheduleUpdate();
  });
})();

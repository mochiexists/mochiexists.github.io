// Cursor-following glow, shared by all pages. Pairs with .glow in mochi.css.
(function () {
  const glow = document.getElementById('glow');
  if (!glow) return;
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
})();

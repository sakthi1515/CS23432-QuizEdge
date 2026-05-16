// Global utilities
document.addEventListener('DOMContentLoaded', () => {
  // Animate elements on load
  document.querySelectorAll('.quiz-card, .stat-card').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.06}s`;
    el.style.animation = 'fadeUp 0.4s ease both';
  });
});

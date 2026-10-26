// Static portfolio mode: never send contact details or resume files.
(() => {
  'use strict';
  const forms = document.querySelectorAll('form[data-portfolio-demo]');
  forms.forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true));
  if (!forms.length) return;
  const note = document.createElement('p');
  note.setAttribute('role', 'note');
  note.textContent = document.documentElement.lang === 'fa'
    ? 'نسخهٔ نمونه‌کار — فرم‌ها نمایشی هستند و اطلاعاتی ارسال نمی‌شود.'
    : 'Portfolio preview — forms are display-only; no information is submitted.';
  Object.assign(note.style, {textAlign:'center', padding:'12px 18px', margin:'0', background:'#F0E6D8', color:'#4D2C29', font:'14px system-ui'});
  document.querySelector('main')?.prepend(note);
})();

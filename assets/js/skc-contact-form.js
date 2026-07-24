(function () {
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-contact-status]');
  if (!form || !status) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const phone = form.querySelector('input[name="phone"]');
    if (phone && !phone.value.trim()) {
      status.textContent = '请先填写手机号，方便少科城顾问与你联系。';
      phone.focus();
      return;
    }
    status.textContent = '已收到咨询占位。后续接入钉钉后，这里会提交到正式渠道。';
    form.classList.add('is-submitted');
  });
})();
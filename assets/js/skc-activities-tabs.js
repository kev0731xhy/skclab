(function () {
  var toggle = document.getElementById('activityCompetitionSwitch');
  var panels = Array.prototype.slice.call(document.querySelectorAll('.skc-activity-panel'));
  var labels = Array.prototype.slice.call(document.querySelectorAll('[data-switch-label]'));

  if (!toggle || !panels.length) {
    return;
  }

  function showPanel(name) {
    panels.forEach(function (panel) {
      var active = panel.getAttribute('data-panel') === name;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });

    labels.forEach(function (label) {
      label.classList.toggle('skc-activity-switch__label--active', label.getAttribute('data-switch-label') === name);
    });
  }

  toggle.addEventListener('change', function () {
    showPanel(toggle.checked ? 'matches' : 'activities');
  });
})();

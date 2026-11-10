document.querySelectorAll('.workflow-explorer').forEach(explorer => {
  const options = explorer.querySelector('.workflow-options');
  const buttons = options.querySelectorAll('[data-workflow-case]');
  const panels = explorer.querySelectorAll('[data-workflow-panel]');

  function showScenario(scenario) {
    explorer.dataset.active = scenario;
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.workflowCase === scenario));
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.workflowPanel !== scenario;
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => showScenario(button.dataset.workflowCase));
  });
  showScenario('standard');
  options.hidden = false;
});

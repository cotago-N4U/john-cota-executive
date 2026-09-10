const scenes = [...document.querySelectorAll('.scene')];
const sceneNames = new Set(scenes.map(scene => scene.id));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollPositions = new Map();
let currentScene = null;

function routeFromHash() {
  const route = location.hash.slice(1);
  return sceneNames.has(route) ? route : 'work';
}

function showScene(route, { focus = true, restore = false } = {}) {
  if (!sceneNames.has(route) || route === currentScene) return;
  if (currentScene) scrollPositions.set(currentScene, window.scrollY);
  scenes.forEach(scene => {
    scene.hidden = scene.id !== route;
    scene.classList.remove('scene-enter');
  });
  currentScene = route;
  document.body.dataset.scene = route;
  const active = document.getElementById(route);
  document.title = active.dataset.title;
  const section = ['partnership', 'operations', 'brand'].includes(route) ? 'work' : route;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === section) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-route]').forEach(link => {
    if (link.dataset.route === route) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  if (focus) active.querySelector('h1').focus({ preventScroll: true });
  // Scene changes are explicit navigation; ordinary scrolling is never intercepted.
  window.scrollTo({ top: restore ? (scrollPositions.get(route) || 0) : 0, behavior: 'instant' });
  if (!reducedMotion.matches && focus) active.classList.add('scene-enter');
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const route = link.getAttribute('href').slice(1);
  if (route === 'main') {
    event.preventDefault();
    document.getElementById('main').focus();
    return;
  }
  if (!sceneNames.has(route)) return;
  event.preventDefault();
  if (route === currentScene) {
    document.getElementById(route).querySelector('h1').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    return;
  }
  history.pushState({ scene: route }, '', '#' + route);
  showScene(route);
});
window.addEventListener('popstate', () => showScene(routeFromHash(), { restore: true }));
window.addEventListener('hashchange', () => showScene(routeFromHash(), { restore: true }));
document.body.dataset.enhanced = 'true';
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
showScene(routeFromHash(), { focus: false });

const perspectives = {
  brand: {
    label: 'The brand perspective',
    explanation: 'A strong idea needs a consistent expression. Brand connects the intention in the brief to the experience people actually receive.',
    stages: [
      ['Find the purpose.', 'Clarify the audience, the message and the reason for the work.'],
      ['Give it expression.', 'Translate direction into a recognizable, coherent brand experience.'],
      ['Protect the promise.', 'Check that the communication is consistent, clear and appropriate.'],
      ['Make it hold together.', 'Carry the identity and message consistently across the final touchpoints.']
    ]
  },
  people: {
    label: 'The people perspective',
    explanation: 'Good work crosses organizational boundaries. Clear ownership and shared decisions connect business partners, creative teams, reviewers and vendors.',
    stages: [
      ['Bring the right people in.', 'Connect the business partner and creative team around a shared understanding.'],
      ['Create with context.', 'Give contributors the direction and collaboration they need to do their best work.'],
      ['Make decisions clear.', 'Bring the relevant compliance, legal, translation and accessibility partners into review.'],
      ['Close the handoff.', 'Align the creative team, business partners and vendors around the final delivery.']
    ]
  },
  operations: {
    label: 'The operations perspective',
    explanation: 'A repeatable process makes room for judgment. Intake, routing, revision control and approvals give the work a dependable path without pretending every request is identical.',
    stages: [
      ['Capture what matters.', 'Use a structured request to establish the scope, requirements and ownership.'],
      ['Make the work visible.', 'Centralize collaboration, revisions and documentation in a shared workflow.'],
      ['Route with purpose.', 'Follow the required review and approval path for the communication and product.'],
      ['Leave a clear record.', 'Connect approval to production with documented decisions and a final version.']
    ]
  }
};

const lensButtons = document.querySelectorAll('.lens-button');
const followWork = document.querySelector('.follow-work');
const stages = document.querySelectorAll('.workflow-stage');
const explanation = document.querySelector('.lens-explanation');

lensButtons.forEach(button => button.addEventListener('click', () => {
  const lens = button.dataset.lens;
  const perspective = perspectives[lens];
  if (!perspective || followWork.dataset.activeLens === lens) return;
  lensButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  followWork.dataset.activeLens = lens;
  stages.forEach((stage, index) => {
    stage.querySelector('h2').textContent = perspective.stages[index][0];
    stage.querySelector('p').textContent = perspective.stages[index][1];
  });
  explanation.querySelector('.lens-label').textContent = perspective.label;
  explanation.querySelector('p').textContent = perspective.explanation;
  followWork.classList.remove('is-changing');
  if (!reducedMotion.matches) requestAnimationFrame(() => requestAnimationFrame(() => followWork.classList.add('is-changing')));
}));
followWork.addEventListener('animationend', () => followWork.classList.remove('is-changing'));
document.querySelector('#year').textContent = new Date().getFullYear();

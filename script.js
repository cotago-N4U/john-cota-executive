const menu = document.querySelector('.menu');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu({ restoreFocus = false } = {}) {
  if (!menu || !mobileNav) return;
  menu.setAttribute('aria-expanded', 'false');
  mobileNav.hidden = true;
  if (restoreFocus) menu.focus();
}

menu?.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!isOpen));
  mobileNav.hidden = isOpen;
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu({ restoreFocus: true });
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

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
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

lensButtons.forEach(button => button.addEventListener('click', () => {
  const lens = button.dataset.lens;
  const perspective = perspectives[lens];
  if (!perspective || followWork.dataset.activeLens === lens) return;
  lensButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  followWork.dataset.activeLens = lens;
  stages.forEach((stage, index) => {
    stage.querySelector('h3').textContent = perspective.stages[index][0];
    stage.querySelector('p').textContent = perspective.stages[index][1];
  });
  explanation.querySelector('.lens-label').textContent = perspective.label;
  explanation.querySelector('p').textContent = perspective.explanation;
  if (!reduceMotion.matches) {
    followWork.classList.remove('is-changing');
    requestAnimationFrame(() => requestAnimationFrame(() => followWork.classList.add('is-changing')));
  }
}));
followWork?.addEventListener('animationend', event => {
  if (event.target === stages[stages.length - 1]) followWork.classList.remove('is-changing');
});
document.querySelector('#year').textContent = new Date().getFullYear();

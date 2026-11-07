import { $, $$, setAriaExpanded } from '../utils/dom.js';

const DOMAIN_DATA = {
  ai: {
    title: 'Artificial Intelligence',
    subtitle: 'Cognitive systems & autonomous reasoning',
    description: 'Neural architectures, autonomous reasoning, generative systems, and cognitive computing pushing the boundaries of machine intelligence. Experience AI competitions and cutting-edge algorithmic frontiers at Techfest.',
  },
  robotics: {
    title: 'Robotics',
    subtitle: 'Humanoid mechatronics & swarm kinematics',
    description: 'Humanoid kinematics, swarm autonomy, bio-inspired locomotion, and industrial mechatronics engineered for extreme environments. Witness international robotic battles and high-precision automation demonstrations.',
  },
  aerospace: {
    title: 'Aerospace',
    subtitle: 'Orbital propulsion & satellite avionics',
    description: 'Orbital propulsion, autonomous flight dynamics, satellite constellations, and deep-space exploration vehicles. Exploring interplanetary telemetry, drone systems, and rocketry with leading aerospace visionaries.',
  },
  quantum: {
    title: 'Quantum Technology',
    subtitle: 'Superconducting qubits & entanglement',
    description: 'Quantum cryptography, superconducting qubits, entanglement networks, and next-generation computational paradigms. Demystifying quantum key distribution and quantum algorithms shaping tomorrow.',
  },
  innovation: {
    title: 'Innovation & Engineering',
    subtitle: 'Sustainable grids & advanced metamaterials',
    description: 'Sustainable energy grids, metamaterials, biotech interfaces, and breakthrough civil & mechanical systems. Where interdisciplinary science converts theoretical research into planetary-scale impact.',
  },
};

export function initDomainModal() {
  const panel = $('#domain-detail-panel');
  const closeBtn = $('#close-domain-panel');
  const domainButtons = $$('.domain-pill-btn');
  const titleEl = $('#domain-modal-title');
  const subtitleEl = $('#domain-modal-subtitle');
  const descEl = $('#domain-modal-desc');

  if (!panel) return;

  domainButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-domain-key');
      const data = DOMAIN_DATA[key];
      if (data) {
        if (titleEl) titleEl.textContent = data.title;
        if (subtitleEl) subtitleEl.textContent = data.subtitle;
        if (descEl) descEl.textContent = data.description;

        domainButtons.forEach((b) => {
          b.classList.remove('active');
          setAriaExpanded(b, false);
        });

        btn.classList.add('active');
        setAriaExpanded(btn, true);

        panel.classList.add('is-active');
        panel.setAttribute('aria-hidden', 'false');
        closeBtn?.focus();
      }
    });
  });

  function closePanel() {
    panel.classList.remove('is-active');
    panel.setAttribute('aria-hidden', 'true');
    domainButtons.forEach((b) => {
      b.classList.remove('active');
      setAriaExpanded(b, false);
    });
  }

  closeBtn?.addEventListener('click', closePanel);

  panel.addEventListener('click', (e) => {
    if (e.target === panel) {
      closePanel();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-active')) {
      closePanel();
    }
  });
}

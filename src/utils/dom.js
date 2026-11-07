/**
 * Safe DOM querying and accessibility attribute management
 */

export function $(selector, scope = document) {
  return scope.querySelector(selector);
}

export function $$(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function setAriaExpanded(element, isExpanded) {
  if (element) {
    element.setAttribute('aria-expanded', String(Boolean(isExpanded)));
  }
}

export function isReducedMotionPreferred() {
  if (document.documentElement.getAttribute('data-reduced-motion') === 'true') {
    return true;
  }
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

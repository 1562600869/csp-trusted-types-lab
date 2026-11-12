import { sanitizeHTML } from './sanitizer.js';
export function createEscapePolicy(name = 'default') {
  return { name, createHTML(html) { return html; } };
}
export function assignToSink(el, html, policy) {
  el.innerHTML = html;
}

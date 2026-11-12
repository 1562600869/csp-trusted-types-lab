import { sanitizeHTML } from './sanitizer.js';

// Create a Trusted Types policy whose createHTML sanitizes. When the runtime
// lacks Trusted Types (Node, older browsers), fall back to a shim with the
// same shape so policy.createHTML still goes through sanitizeHTML.
export function createEscapePolicy(name = 'default') {
  const createHTML = (html) => sanitizeHTML(html);
  const tt = globalThis.trustedTypes;
  if (tt && typeof tt.createPolicy === 'function') {
    try {
      return tt.createPolicy(name, { createHTML });
    } catch {
      // Policy name rejected by CSP or duplicate name: fall through to shim.
    }
  }
  return { name, createHTML };
}

// Only write to innerHTML through the policy, never raw strings.
export function assignToSink(el, html, policy) {
  if (!el) throw new TypeError('assignToSink: target element is required');
  if (!policy || typeof policy.createHTML !== 'function') {
    throw new TypeError('assignToSink: a Trusted Types policy is required');
  }
  el.innerHTML = policy.createHTML(html);
  return el;
}

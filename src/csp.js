// Build a CSP string from the policy-panel options.
export function buildCSP(options = {}) {
  const directives = [];
  if (options.scriptSelf) directives.push("script-src 'self'");
  if (options.objectNone) directives.push("object-src 'none'");
  if (options.requireTT) directives.push("require-trusted-types-for 'script'");
  return directives.join('; ');
}

// Statically inspect a payload and report which CSP rules would block it.
export function validatePayload(payload, policy = {}) {
  const reasons = [];
  const html = String(payload ?? '');

  if (/<\s*script\b/i.test(html)) {
    reasons.push(policy.scriptSelf
      ? "inline <script> blocked: script-src 'self' forbids inline scripts"
      : 'contains <script> tag');
  }
  if (/\son[a-zA-Z]+\s*=/i.test(html)) {
    reasons.push('inline event handler (on*) blocked by CSP');
  }
  if (/(?:javascript|vbscript)\s*:/i.test(html)) {
    reasons.push('javascript:/vbscript: URL blocked by CSP');
  }
  if (/<\s*(?:object|embed)\b/i.test(html) && policy.objectNone) {
    reasons.push("object/embed blocked: object-src 'none'");
  }
  if (/<\s*iframe\b/i.test(html)) {
    reasons.push('iframe payload flagged as risky');
  }

  return { blocked: reasons.length > 0, reasons };
}

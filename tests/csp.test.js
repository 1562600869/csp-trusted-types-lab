import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCSP, validatePayload } from '../src/csp.js';
import { createEscapePolicy, assignToSink } from '../src/trustedTypes.js';
test('buildCSP includes selected directives', () => {
  const csp = buildCSP({ scriptSelf: true, objectNone: true, requireTT: true });
  assert.match(csp, /script-src 'self'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /require-trusted-types-for 'script'/);
});
test('validatePayload blocks script payloads', () => {
  const r = validatePayload('<script>alert(1)</script>', { scriptSelf: true });
  assert.equal(r.blocked, true);
  assert.ok(r.reasons.length >= 1);
});
test('policy createHTML sanitizes', () => {
  const policy = createEscapePolicy('lab');
  const html = String(policy.createHTML('<img src=x onerror=alert(1)><b>t</b>'));
  assert.doesNotMatch(html, /onerror/i);
  assert.match(html, /<b>t<\/b>/);
});
test('assignToSink uses policy output', () => {
  const el = { innerHTML: '' };
  const policy = createEscapePolicy('lab');
  assignToSink(el, '<script>bad</script><i>ok</i>', policy);
  assert.doesNotMatch(el.innerHTML, /script/i);
  assert.match(el.innerHTML, /<i>ok<\/i>/);
});

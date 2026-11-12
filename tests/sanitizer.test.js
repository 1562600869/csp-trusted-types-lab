import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeHTML } from '../src/sanitizer.js';
test('strips script tags', () => {
  const out = sanitizeHTML('<b>ok</b><script>alert(1)</script>');
  assert.match(out, /<b>ok<\/b>/);
  assert.doesNotMatch(out, /script/i);
});
test('strips event handler attrs and javascript urls', () => {
  const out = sanitizeHTML('<a href="javascript:alert(1)" onclick="x()">x</a><img src="https://a/b.png" onerror="x()">');
  assert.doesNotMatch(out, /onclick|onerror|javascript:/i);
  assert.match(out, /https:\/\/a\/b\.png/);
});

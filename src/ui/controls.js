import { sanitizeHTML } from '../sanitizer.js';
import { createEscapePolicy, assignToSink } from '../trustedTypes.js';
import { buildCSP, validatePayload } from '../csp.js';

export function bindControls(ctx) {
  const { payload, preview, stats, cspOutput, status } = ctx;
  const policy = createEscapePolicy('lab');

  const boxes = Array.from(
    document.querySelectorAll('#controls input[type="checkbox"][data-key]')
  );
  const currentOptions = () =>
    Object.fromEntries(boxes.map((b) => [b.dataset.key, b.checked]));

  const renderCSP = () => {
    cspOutput.textContent = buildCSP(currentOptions()) || '(no directives selected)';
  };
  boxes.forEach((b) => b.addEventListener('change', renderCSP));
  renderCSP();

  const showStats = (action, extra = {}) => {
    const report = { action, ...validatePayload(payload.value, currentOptions()), ...extra };
    stats.textContent = JSON.stringify(report, null, 2);
  };

  const fail = (err) => {
    status.textContent = `error: ${(err && err.message) || err}`;
  };

  document.querySelector('#btn-sanitize').addEventListener('click', () => {
    try {
      const clean = sanitizeHTML(payload.value, currentOptions());
      assignToSink(preview, clean, policy);
      showStats('sanitize', { outputLength: clean.length });
      status.textContent = 'ready';
    } catch (err) {
      fail(err);
    }
  });

  document.querySelector('#btn-assign').addEventListener('click', () => {
    try {
      assignToSink(preview, payload.value, policy);
      showStats('assign');
      status.textContent = 'ready';
    } catch (err) {
      fail(err);
    }
  });
}

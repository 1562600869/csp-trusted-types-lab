import { bindControls } from './ui/controls.js';
const status = document.querySelector('#status');
try {
  bindControls({ payload: document.querySelector('#payload'), preview: document.querySelector('#preview'), stats: document.querySelector('#stats'), cspOutput: document.querySelector('#csp-output'), status });
  status.textContent = 'ready';
} catch (err) { status.textContent = `error: ${err.message || err}`; }

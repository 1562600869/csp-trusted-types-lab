export function sanitizeHTML(input, policy = {}) {
  return String(input ?? '');
}

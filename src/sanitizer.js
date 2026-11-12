// String-based HTML sanitizer (works in browser and Node, no DOM required).
const DANGEROUS_TAGS = ['script', 'iframe', 'object', 'embed', 'style', 'link', 'meta'];

export function sanitizeHTML(input, policy = {}) {
  let html = String(input ?? '');

  // 1. Remove dangerous tags together with their contents.
  for (const tag of DANGEROUS_TAGS) {
    const block = new RegExp(`<\\s*${tag}\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*${tag}\\s*>`, 'gi');
    html = html.replace(block, '');
    const lone = new RegExp(`<\\s*\\/?\\s*${tag}\\b[^>]*\\/?\\s*>`, 'gi');
    html = html.replace(lone, '');
  }

  // 2. Remove inline event handler attributes (on*), quoted or unquoted.
  html = html.replace(/\s+on[a-zA-Z]+\s*=\s*"[^"]*"/gi, '');
  html = html.replace(/\s+on[a-zA-Z]+\s*=\s*'[^']*'/gi, '');
  html = html.replace(/\s+on[a-zA-Z]+\s*=\s*[^\s>]+/gi, '');

  // 3. Neutralize javascript:/vbscript:/data: URLs in href/src, keep http(s).
  html = html.replace(
    /(\b(?:href|src)\s*=\s*)(["']?)\s*(?:javascript|vbscript|data)\s*:[^"'>\s]*\2/gi,
    '$1$2#$2'
  );
  // Catch any leftover javascript: literal (e.g. inside weird nesting).
  html = html.replace(/(?:javascript|vbscript)\s*:/gi, '');

  return html;
}

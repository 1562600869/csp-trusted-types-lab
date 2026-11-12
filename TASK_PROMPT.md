请在本仓库实现一个可在浏览器打开的「CSP + Trusted Types XSS 防御实验室」（禁止 Docker），并让 `npm test` 全部通过。

硬性需求：
1) 打开 `index.html`（`npm start` 或 `python3 -m http.server 8781 --directory .`）后：左侧输入/预览区、右侧策略面板；成功时 `#status` 为 `ready`。
2) 实现 `src/sanitizer.js`：`sanitizeHTML(input, policy)` 必须移除 `script`、事件处理器属性（on*）、`javascript:` URL；保留安全标签与 `href/src` 的 http(s) 链接。故意留空/写错的逻辑要修到与测试一致。
3) 实现 `src/trustedTypes.js`：`createEscapePolicy(name)` 创建 Trusted Types policy（若运行时无 Trusted Types，则提供兼容 shim，使 `policy.createHTML` 仍走 sanitize）。`assignToSink(el, html, policy)` 只能通过 policy 写入 `innerHTML`。
4) 实现 `src/csp.js`：根据面板选项生成 CSP 字符串（至少支持 `script-src 'self'`、`object-src 'none'`、可选 `require-trusted-types-for 'script'`），并在页面用 `#csp-output` 展示；`validatePayload(payload, policy)` 返回 `{blocked:boolean, reasons:string[]}`。
5) 实现 `src/ui/controls.js` 的 `bindControls`：可粘贴 payload、选择策略、点 `Sanitize` / `Try Assign`；结果写入 `#preview` 与 `#stats`；错误写 `#status`。
6) 不要 Docker，不要改弱 `tests/*.test.js`，保持原生 ESM。用多个短 shell 命令分别写文件，写完立刻 `npm test`，失败再修直到通过。

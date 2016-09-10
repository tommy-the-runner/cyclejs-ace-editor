'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyParam;
function applyParam(editor, key, value) {
  switch (key) {
    case 'theme':
      editor.setTheme(value);
      break;
    case 'mode':
      editor.session.setMode(value);
      break;
    case 'readOnly':
      editor.setReadOnly(value);
      break;
    case 'fontSize':
      editor.setFontSize(value);
      break;

    default:
      throw new Error('Unrecognized configuration key: ' + key + ', use `editor$` sink and handle it on your own');
  }
}
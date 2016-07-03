'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyParams;
exports.default = applyParam;
function applyParams(editor$, params$) {
  return editor$.flatMap(function (editor) {
    return params$.reduce(function (editor, config) {
      var key = config[0];
      var value = config[1];

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

        default:
          throw new Error('Unrecognized configuration key: ' + key + ', use `editor$` sink and handle it on your own');
      }
      return editor;
    }, editor);
  });
}

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

    default:
      throw new Error('Unrecognized configuration key: ' + key + ', use `editor$` sink and handle it on your own');
  }
}
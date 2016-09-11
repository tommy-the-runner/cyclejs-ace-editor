export default function applyParam(editor, key, value) {
  switch(key) {
    case 'theme':
      editor.setTheme(value)
      break
    case 'sessionOptions':
      editor.session.setOptions(value)
      break
    case 'readOnly':
      editor.setReadOnly(value)
      break
    case 'fontSize':
      editor.setFontSize(value)
      break

    // Deprecated
    case 'mode':
      editor.session.setMode(value)
      break

    default:
      throw new Error('Unrecognized configuration key: ' + key + ', use `editor$` sink and handle it on your own')
  }
}

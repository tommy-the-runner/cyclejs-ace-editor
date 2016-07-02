export default function applyParams(editor$, params$) {
  return editor$
    .flatMap(editor => {
      return params$.reduce((editor, config) => {
        const key = config[0]
        const value = config[1]

        switch(key) {
          case 'theme':
            editor.setTheme(value)
            break
          case 'mode':
            editor.session.setMode(value)
            break
          case 'readOnly':
            editor.setReadOnly(value)
            break

          default:
            throw new Error('Unrecognized configuration key: ' + key + ', use `editor$` sink and handle it on your own')
        }
        return editor
      }, editor)
    })
}

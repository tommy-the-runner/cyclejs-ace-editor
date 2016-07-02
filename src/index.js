import {div, pre} from '@cycle/dom'
import isolate from '@cycle/isolate'
import {ReplaySubject, Observable} from 'rx'

var ace

if (typeof window !== 'undefined') {
  ace = require('brace')
}

function intentEditorCode(editor$) {
  const editorCode$ = editor$
    .flatMap(editor => {
      let subject = new ReplaySubject(1)

      editor.on('change', e => {
        const value = editor.getValue()
        subject.onNext(value)
      })

      return subject
    })

  const subject$ = new ReplaySubject(1)

  editorCode$
    .multicast(subject$)
    .connect()

  return subject$
}

function intent({DOM, params$, initialValue$}) {
  const editor$ = DOM.select('pre')
    .observable
    .filter(els => els.length > 0)
    .map(els => els[0])
    .map(el => {
      const editor = ace.edit(el)
      return editor
    })

  const editorCode$ = intentEditorCode(editor$)

  const flatParams$ = params$.concatMap(params => {
    const keys = Object.keys(params)

    const paramsArray = keys.map(key => [key, params[key]])
    return Observable.from(paramsArray)
  })

  return {
    editor$,
    editorCode$,
    params$: flatParams$,
    initialValue$: initialValue$ || Observable.just('')
  }
}

function model({editor$, editorCode$, initialValue$, params$}) {
  editor$
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
    .subscribe()

  return {
    value$: initialValue$.concat(editorCode$)
  }
}

function view(initialValue$) {

  return initialValue$.take(1).map(code =>
    div([
      pre(code)
    ])
  )
}

function AceEditor(sources) {
  const {editorCode$, editor$, initialValue$, params$} = intent(sources)
  const {value$} = model({editorCode$, editor$, initialValue$, params$})
  const vtree$ = view(initialValue$)

  return {
    DOM: vtree$,
    value$: value$,
    editor$: editor$
  }
}

function AceEditorWrapper(sources) {
  return isolate(AceEditor)(sources)
}

export default AceEditorWrapper

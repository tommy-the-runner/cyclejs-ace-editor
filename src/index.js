import {div, pre} from '@cycle/dom'
import isolate from '@cycle/isolate'
import {ReplaySubject, Observable} from 'rx'

var ace

if (typeof window !== 'undefined') {
  ace = require('brace')
}

function getIdFrom(DOM) {
  if (!DOM.namespace) {
    return ''
  }

  const lastNamespace = DOM.namespace.slice(-1).shift()
  return lastNamespace.replace('.', 'editor-')
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

function intent(id, {DOM, value$, config$}) {
  const editor$ = DOM.select(`#${id}`)
    .observable
    .filter(els => els.length > 0)
    .map(els => els[0])
    .map(el => {
      const editor = ace.edit(el.id)
      return editor
    })

  const editorCode$ = intentEditorCode(editor$)

  const flatConfig$ = config$.concatMap(config => {
    const keys = Object.keys(config)

    const configArray = keys.map(key => [key, config[key]])
    return Observable.from(configArray)
  })

  return {
    editor$,
    config$: flatConfig$,
    editorCode$,
    value$: value$ || Observable.just('')
  }
}

function model({editor$, editorCode$, value$, config$}) {
  editor$
    .flatMap(editor => {
      return config$.reduce((editor, config) => {
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
    code$: value$.concat(editorCode$)
  }
}

function view(id, value$) {

  return value$.take(1).map(code =>
    div([
      pre(`#${id}`, code)
    ])
  )
}

function AceEditor(sources) {
  const id = getIdFrom(sources.DOM)

  const {editorCode$, editor$, value$, config$} = intent(id, sources)
  const {code$} = model({editorCode$, editor$, value$, config$})
  const vtree$ = view(id, value$)

  return {
    DOM: vtree$,
    code$: code$,
    editor$: editor$
  }
}

function AceEditorWrapper(sources) {
  return isolate(AceEditor)(sources)
}

export default AceEditorWrapper

import {div, pre} from '@cycle/dom'
import isolate from '@cycle/isolate'
import {ReplaySubject, Observable} from 'rx'
import AceEditorWidget from './ace_editor_widget'
import applyParam from './apply_param'

var ace

if (typeof window !== 'undefined') {
  ace = require('brace')
}

function intent({DOM, params$, initialValue$}) {
  const editor$ = DOM.select('.ace_editor')
    .observable
    .filter(els => els.length > 0)
    .map(els => els[0])
    .map(el => ace.edit(el))

  const flatParams$ = (params$ || Observable.empty())
    .concatMap(params => {
      const keys = Object.keys(params)

      const paramsArray = keys.map(key => [key, params[key]])
      return Observable.from(paramsArray)
    })

  return {
    editor$,
    params$: flatParams$,
    initialValue$: initialValue$ || Observable.just('')
  }
}

function model({editor$, initialValue$, params$}) {
  editor$
    .distinctUntilChanged()
    .flatMap(editor => {
      return params$.map((config) => {
        const key = config[0]
        const value = config[1]

        return {editor, key, value}
      })
    })
    .subscribe(({editor, key, value}) => applyParam(editor, key, value))


  const editorCode$ = editor$
    .map(editor => {
      let subject = new ReplaySubject(1)

      editor.on('change', e => {
        const value = editor.getValue()
        subject.onNext(value)
      })

      return subject
    })
    .switch()

  return {
    value$: initialValue$.concat(editorCode$)
  }
}

function view(initialValue$) {

  return initialValue$.take(1).map(code =>
    div([
      new AceEditorWidget(code)
    ])
  )
}

function AceEditor(sources) {
  const {editor$, initialValue$, params$} = intent(sources)
  const {value$} = model({editor$, initialValue$, params$})
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

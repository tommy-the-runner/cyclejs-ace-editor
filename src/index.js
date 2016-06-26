import Cycle from '@cycle/core'
import {div, h3, pre, makeDOMDriver} from '@cycle/dom'
import {Observable} from 'rx'
import AceEditor from '../../src'

function main({DOM}) {
  const editorProps$ = Observable.of()

  const editor = AceEditor({DOM, config$: editorProps$})

  return {
    DOM: Observable.combineLatest(editor.DOM, editor.code$.debounce(100),
      (editorVTree, code) => {
        return div([
          editorVTree,
          h3('Debounced value'),
          pre(code)
        ])
      })
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#example')
})

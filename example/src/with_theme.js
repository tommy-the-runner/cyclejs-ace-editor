import Cycle from '@cycle/core'
import {div, h3, pre, makeDOMDriver} from '@cycle/dom'
import {Observable} from 'rx'
import AceEditor from '../../src'

// Import theme before we can use it
import 'brace/theme/monokai'

function main({DOM}) {
  const initialValue$ = Observable.just('Initial code')
  const params$ = Observable.just({
    theme: 'ace/theme/monokai'
  })
  const editor = AceEditor({DOM, params$, initialValue$})

  return {
    DOM: Observable.combineLatest(editor.DOM, editor.value$.debounce(100),
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
  DOM: makeDOMDriver('#example2')
})

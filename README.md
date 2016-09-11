# cyclejs-ace-editor [![Build Status](https://travis-ci.org/tommy-the-runner/cyclejs-ace-editor.svg?branch=master)](https://travis-ci.org/tommy-the-runner/cyclejs-ace-editor)

Cycle.js intergration with [Ace Editor](https://ace.c9.io/) using
[brace](https://github.com/thlorenz/brace).

See [live example](https://tommy-the-runner.github.io/cyclejs-ace-editor/).

## Installation

```
npm install cyclejs-ace-editor --save
```

## API

```
{editor$, value$} = AceEditor({DOM, params$, initialValue$})
```

Sources:

 - `params$` - observable with a key-value configuration
 - `initialValue$` - observable with a string as initial editor code
 - `DOM` - DOM driver

Sinks:

 - `editor$` - instance of Ace Editor, use when there is no built-in wrapper for the feature you want
 - `value$` - observable of editor content


Supported keys for the params:
 - `theme`
 - `readOnly`
 - `fontSize`
 - `sessionOptions` - calls `editor.session.setOptions()`
 
Supported, but deprecated: 
 - `mode` - use `sessionOptions` instead

## Example

```js
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
  DOM: makeDOMDriver('#example')
})
```


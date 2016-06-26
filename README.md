# cyclejs-ace-editor

Cycle.js intergration with [Ace Editor](https://ace.c9.io/) using
[brace](https://github.com/thlorenz/brace).

See [live example](https://tommy-the-runner.github.io/cyclejs-ace-editor/).

## API

```
{editor$, code$} = AceEditor({DOM, value$, config$})
```

Sources:

 - `value$` - observable with an initial value
 - `config$` - observable with a key-value configuration
 - `DOM` - DOM driver

Sinks:

 - `editor$` - instance of Ace Editor, use when there is no built-in wrapper for the feature you want
 - `code$` - observable of editor content


Supported keys for the config:
 - `theme`
 - `mode`
 - `readOnly`

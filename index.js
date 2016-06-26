'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = require('@cycle/dom');

var _isolate = require('@cycle/isolate');

var _isolate2 = _interopRequireDefault(_isolate);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ace;

if (typeof window !== 'undefined') {
  ace = require('brace');
}

function getIdFrom(DOM) {
  if (!DOM.namespace) {
    return '';
  }

  var lastNamespace = DOM.namespace.slice(-1).shift();
  return lastNamespace.replace('.', 'editor-');
}

function intentEditorCode(editor$) {
  var editorCode$ = editor$.flatMap(function (editor) {
    var subject = new _rx.ReplaySubject(1);

    editor.on('change', function (e) {
      var value = editor.getValue();
      subject.onNext(value);
    });

    return subject;
  });

  var subject$ = new _rx.ReplaySubject(1);

  editorCode$.multicast(subject$).connect();

  return subject$;
}

function intent(id, _ref) {
  var DOM = _ref.DOM;
  var value$ = _ref.value$;
  var config$ = _ref.config$;

  var editor$ = DOM.select('#' + id).observable.filter(function (els) {
    return els.length > 0;
  }).map(function (els) {
    return els[0];
  }).map(function (el) {
    var editor = ace.edit(el.id);
    return editor;
  });

  var editorCode$ = intentEditorCode(editor$);

  var flatConfig$ = config$.concatMap(function (config) {
    var keys = Object.keys(config);

    var configArray = keys.map(function (key) {
      return [key, config[key]];
    });
    return _rx.Observable.from(configArray);
  });

  return {
    editor$: editor$,
    config$: flatConfig$,
    editorCode$: editorCode$,
    value$: value$ || _rx.Observable.just('')
  };
}

function model(_ref2) {
  var editor$ = _ref2.editor$;
  var editorCode$ = _ref2.editorCode$;
  var value$ = _ref2.value$;
  var config$ = _ref2.config$;

  editor$.flatMap(function (editor) {
    return config$.reduce(function (editor, config) {
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
  }).subscribe();

  return {
    code$: value$.concat(editorCode$)
  };
}

function view(id, value$) {

  return value$.take(1).map(function (code) {
    return (0, _dom.div)([(0, _dom.pre)('#' + id, code)]);
  });
}

function AceEditor(sources) {
  var id = getIdFrom(sources.DOM);

  var _intent = intent(id, sources);

  var editorCode$ = _intent.editorCode$;
  var editor$ = _intent.editor$;
  var value$ = _intent.value$;
  var config$ = _intent.config$;

  var _model = model({ editorCode$: editorCode$, editor$: editor$, value$: value$, config$: config$ });

  var code$ = _model.code$;

  var vtree$ = view(id, value$);

  return {
    DOM: vtree$,
    code$: code$,
    editor$: editor$
  };
}

function AceEditorWrapper(sources) {
  return (0, _isolate2.default)(AceEditor)(sources);
}

exports.default = AceEditorWrapper;

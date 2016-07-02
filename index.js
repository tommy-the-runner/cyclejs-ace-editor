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

var AceEditorWidget = function AceEditorWidget() {};

AceEditorWidget.prototype.type = 'Widget';

AceEditorWidget.prototype.init = function () {
  var el = document.createElement('pre');
  this.editor = ace.edit(el);
  return el;
};

AceEditorWidget.prototype.update = function (previous, domNode) {};

AceEditorWidget.prototype.destroy = function (domNode) {
  this.editor.destroy();
  this.editor.container.remove();
};

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

function intent(_ref) {
  var DOM = _ref.DOM;
  var params$ = _ref.params$;
  var initialValue$ = _ref.initialValue$;

  var editor$ = DOM.select('.ace_editor').observable.filter(function (els) {
    return els.length > 0;
  }).map(function (els) {
    return els[0];
  }).map(function (el) {
    var editor = ace.edit(el);
    return editor;
  });

  var editorCode$ = intentEditorCode(editor$);

  var flatParams$ = params$.concatMap(function (params) {
    var keys = Object.keys(params);

    var paramsArray = keys.map(function (key) {
      return [key, params[key]];
    });
    return _rx.Observable.from(paramsArray);
  });

  return {
    editor$: editor$,
    editorCode$: editorCode$,
    params$: flatParams$,
    initialValue$: initialValue$ || _rx.Observable.just('')
  };
}

function model(_ref2) {
  var editor$ = _ref2.editor$;
  var editorCode$ = _ref2.editorCode$;
  var initialValue$ = _ref2.initialValue$;
  var params$ = _ref2.params$;

  editor$.flatMap(function (editor) {
    return params$.reduce(function (editor, config) {
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
    value$: initialValue$.concat(editorCode$)
  };
}

function view(initialValue$) {

  return initialValue$.take(1).map(function (code) {
    return (0, _dom.div)([new AceEditorWidget(code)]);
  });
}

function AceEditor(sources) {
  var _intent = intent(sources);

  var editorCode$ = _intent.editorCode$;
  var editor$ = _intent.editor$;
  var initialValue$ = _intent.initialValue$;
  var params$ = _intent.params$;

  var _model = model({ editorCode$: editorCode$, editor$: editor$, initialValue$: initialValue$, params$: params$ });

  var value$ = _model.value$;

  var vtree$ = view(initialValue$);

  return {
    DOM: vtree$,
    value$: value$,
    editor$: editor$
  };
}

function AceEditorWrapper(sources) {
  return (0, _isolate2.default)(AceEditor)(sources);
}

exports.default = AceEditorWrapper;

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = require('@cycle/dom');

var _isolate = require('@cycle/isolate');

var _isolate2 = _interopRequireDefault(_isolate);

var _rx = require('rx');

var _ace_editor_widget = require('./ace_editor_widget');

var _ace_editor_widget2 = _interopRequireDefault(_ace_editor_widget);

var _apply_param = require('./apply_param');

var _apply_param2 = _interopRequireDefault(_apply_param);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ace;

if (typeof window !== 'undefined') {
  ace = require('brace');
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
    return ace.edit(el);
  });

  var flatParams$ = params$.concatMap(function (params) {
    var keys = Object.keys(params);

    var paramsArray = keys.map(function (key) {
      return [key, params[key]];
    });
    return _rx.Observable.from(paramsArray);
  });

  return {
    editor$: editor$,
    params$: flatParams$,
    initialValue$: initialValue$ || _rx.Observable.just('')
  };
}

function model(_ref2) {
  var editor$ = _ref2.editor$;
  var initialValue$ = _ref2.initialValue$;
  var params$ = _ref2.params$;

  editor$.flatMap(function (editor) {
    return params$.map(function (config) {
      var key = config[0];
      var value = config[1];

      return { editor: editor, key: key, value: value };
    });
  }).subscribe(function (_ref3) {
    var editor = _ref3.editor;
    var key = _ref3.key;
    var value = _ref3.value;
    return (0, _apply_param2.default)(editor, key, value);
  });

  var editorCode$ = editor$.map(function (editor) {
    var subject = new _rx.ReplaySubject(1);

    editor.on('change', function (e) {
      var value = editor.getValue();
      subject.onNext(value);
    });

    return subject;
  }).switch();

  return {
    value$: initialValue$.concat(editorCode$)
  };
}

function view(initialValue$) {

  return initialValue$.take(1).map(function (code) {
    return (0, _dom.div)([new _ace_editor_widget2.default(code)]);
  });
}

function AceEditor(sources) {
  var _intent = intent(sources);

  var editor$ = _intent.editor$;
  var initialValue$ = _intent.initialValue$;
  var params$ = _intent.params$;

  var _model = model({ editor$: editor$, initialValue$: initialValue$, params$: params$ });

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
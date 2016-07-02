'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = require('@cycle/dom');

var _isolate = require('@cycle/isolate');

var _isolate2 = _interopRequireDefault(_isolate);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ace;

if (typeof window !== 'undefined') {
  ace = require('brace');
}

var AceEditorWidget = function () {
  function AceEditorWidget(initialValue) {
    _classCallCheck(this, AceEditorWidget);

    this.type = 'Widget';
    this.initialValue = initialValue;
  }

  _createClass(AceEditorWidget, [{
    key: 'init',
    value: function init() {
      var el = document.createElement('pre');
      el.textContent = this.initialValue;
      this.editor = ace.edit(el);
      return el;
    }
  }, {
    key: 'update',
    value: function update(previous, domNode) {}
  }, {
    key: 'destroy',
    value: function destroy(domNode) {
      this.editor.destroy();
      this.editor.container.remove();
    }
  }]);

  return AceEditorWidget;
}();

function applyParams(editor$, params$) {
  return editor$.flatMap(function (editor) {
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
  });
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

  applyParams(editor$, params$).subscribe();

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
    return (0, _dom.div)([new AceEditorWidget(code)]);
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

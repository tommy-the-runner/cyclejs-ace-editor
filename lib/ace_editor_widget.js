'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

exports.default = AceEditorWidget;
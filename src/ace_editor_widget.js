var ace

if (typeof window !== 'undefined') {
  ace = require('brace')
}

var AceEditorWidget = function (initialValue) {
  this.initialValue = initialValue
}

AceEditorWidget.prototype.type = 'Widget'

AceEditorWidget.prototype.init = function() {
  const el = document.createElement('pre')
  el.textContent = this.initialValue
  this.editor = ace.edit(el)
  return el
}

AceEditorWidget.prototype.update = function(previous, domNode) {

}

AceEditorWidget.prototype.destroy = function(domNode) {
  this.editor.destroy()
  this.editor.container.remove()
}

export default AceEditorWidget

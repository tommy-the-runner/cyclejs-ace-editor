export default class AceEditorWidget {
  constructor(initialValue) {
    this.type = 'Widget'
    this.initialValue = initialValue
  }

  init() {
    const el = document.createElement('pre')
    el.textContent = this.initialValue
    this.editor = ace.edit(el)
    return el
  }

  update(previous, domNode) {
    this.editor = previous.editor
  }

  destroy(domNode) {
    this.editor.destroy()
    this.editor.container.remove()
  }
}

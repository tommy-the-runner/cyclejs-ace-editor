import applyParam from '../src/apply_param'

describe('apply_param', function () {
  beforeEach(function () {
    this.editor = {
      setReadOnly: sinon.spy(),
      setTheme: sinon.spy(),
      setFontSize: sinon.spy(),
      session: {
        setMode: sinon.spy()
      }
    }
  })

  it('should apply theme', function () {
    applyParam(this.editor, 'theme', 'ace/theme/monokai')
    expect(this.editor.setTheme).to.have.been.calledWith('ace/theme/monokai')
  })

  it('should apply mode', function () {
    applyParam(this.editor, 'mode', 'ace/mode/javascript')
    expect(this.editor.session.setMode).to.have.been.calledWith('ace/mode/javascript')
  })

  it('should apply read only', function () {
    applyParam(this.editor, 'readOnly', true)
    expect(this.editor.setReadOnly).to.have.been.calledWith(true)
  })

  it('should apply font size', function () {
    applyParam(this.editor, 'fontSize', 11)
    expect(this.editor.setFontSize).to.have.been.calledWith(11)
  })

  it('should throw an exception when option is not recognized', function () {
    expect(()=> applyParam(this.editor, 'unknown-option', true)).to.throw(/unrecognized configuration/i)
  })
})

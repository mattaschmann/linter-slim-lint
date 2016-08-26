LinterSlimLintView = require './linter-slim-lint-view'
{CompositeDisposable} = require 'atom'

module.exports = LinterSlimLint =
  linterSlimLintView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @linterSlimLintView = new LinterSlimLintView(state.linterSlimLintViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @linterSlimLintView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'linter-slim-lint:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @linterSlimLintView.destroy()

  serialize: ->
    linterSlimLintViewState: @linterSlimLintView.serialize()

  toggle: ->
    console.log 'LinterSlimLint was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()

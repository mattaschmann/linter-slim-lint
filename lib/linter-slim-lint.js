'use babel';

import LinterSlimLintView from './linter-slim-lint-view';
import { CompositeDisposable } from 'atom';

export default {

  linterSlimLintView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.linterSlimLintView = new LinterSlimLintView(state.linterSlimLintViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.linterSlimLintView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-slim-lint:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.linterSlimLintView.destroy();
  },

  serialize() {
    return {
      linterSlimLintViewState: this.linterSlimLintView.serialize()
    };
  },

  toggle() {
    console.log('LinterSlimLint was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};

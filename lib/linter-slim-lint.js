'use babel';

/* global atom */

const helpers = require('atom-linter');

const CONFIG_KEY = 'linter-slim-lint.config';
const COMMAND_KEY = 'linter-slim-lint.command';

module.exports = {
  activate() {
    this.command = atom.config.get(COMMAND_KEY);
  },
  provideLinter() {
    return {
      name: 'slim-lint',
      grammarScopes: ['text.slim'],
      scope: 'file',
      lintOnFly: true,

      lint: textEditor => {
        let buffer = textEditor.getBuffer();
        if (buffer.isModified()) return;
        if (buffer.isEmpty()) return;

        this.path = textEditor.getPath();
        this.config = helpers.find(this.path, atom.config.get(CONFIG_KEY));

        if (!this.config) {
          atom.notifications.addError('linter-slim-lint: Invalid config file!', { dismissable: true });
          return [];
        }

        return new Promise((resolve, reject) => {
          let results = [];

          helpers.exec(
            this.command,
            ['-c', this.config, this.path], {
              stream: 'stdout',
              ignoreExitCode: true,
              throwOnStdErr: false
            }
          ).then(value => {
            value.split('\n').map(line => {
              let result = line.match(/:([0-9].*)\s\[([A-Z])\]\s([\w].*):\s(.*)/);

              if (!result) {
                return;
              }

              let lineNumber = parseInt(result[1], 10) - 1;
              let range = helpers.rangeFromLineNumber(textEditor, lineNumber);
              let htmlMessage = '<span class="badge badge-flexible eslint">' + result[3] + '</span> ' + result[4];

              results.push({
                type: result[2] === 'E' ? 'Error' : 'Warning',
                html: htmlMessage,
                range: range,
                filePath: textEditor.getPath()
              });
            });

            resolve(results);
          }, reject);
        });
      }
    };
  },

  config: {
    command: {
      type: 'string',
      title: 'Command',
      default: 'slim-lint',
      description: 'The absolute path to your `slim-lint` command.  use the command `which slim-lint` to find out \
                    the correct command for the ruby version you are using.'
    },
    config: {
      type: 'string',
      title: 'Config Filename',
      default: '.slim-lint.yml',
      description: 'The name of your ".slim-lint" config file.  This file will be searched recursively down from the \
                    current file\'s location'
    }
  }

};

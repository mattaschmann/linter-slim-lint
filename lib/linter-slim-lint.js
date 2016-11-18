'use babel';

/* global atom */

const helpers = require('atom-linter');

const CONFIG_KEY = 'linter-slim-lint.config';
const COMMAND_KEY = 'linter-slim-lint.command';
const URL_BASE = 'https://github.com/sds/slim-lint/blob/master/lib/slim_lint/linter/README.md'

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
        this.parameters = [];

        if (this.config) {
          this.parameters.push('-c', this.config, this.path);
        } else {
          this.parameters.push(this.path);
        }

        return new Promise((resolve, reject) => {
          let results = [];

          helpers.exec(
            this.command,
            this.parameters, {
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
              let htmlMessage = `${result[3]}: ${result[4]} (<a href="${URL_BASE}#${result[3].toLowerCase()}">${result[3]}</a>)`;

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

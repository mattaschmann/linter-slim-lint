'use babel';

const Helpers = require('atom-linter');

// @Matt TODO make this dynamic
const CONFIG = '/Users/mattaschmann/.slim-lint.yml';

// @Matt TODO get classes and names to show up right

module.exports = {
  activate() {
    // @Matt TODO set config file?
  },
  deactivate() {
    // @Matt TODO if applicable
  },
  provideLinter() {
    return {
      name: 'slim-lint',
      grammarScopes: ['text.slim'], // ['*'] will get it triggered regardless of grammar
      scope: 'file', // or 'project'
      lintOnFly: false,
      lint: textEditor => {

        return new Promise((resolve, reject) => {
          // @Matt TODO return early if no text
          var results = [];

          // @Matt TODO work on the buffer
          // @Matt TODO generalize path
          Helpers.exec(
            '/Users/mattaschmann/.rvm/gems/ruby-2.3.1/bin/slim-lint',
            ['-c', CONFIG, textEditor.getPath()], {
              stream: 'stdout',
              ignoreExitCode: true,
              throwOnStdErr: false
            }
          ).then(value => {
            value.split('\n').map(line => {
              var result = line.match(/:([0-9].*)\s\[([A-Z])\]\s([\w].*):\s(.*)/);

              if (!result) {
                return;
              }

              var lineNumber = parseInt(result[1], 10) - 1;
              var range = Helpers.rangeFromLineNumber(textEditor, lineNumber);
              var htmlMessage = '<span class="badge badge-flexible eslint">' + result[3] + '</span> ' + result[4];

              results.push({
                type: result[2] === 'E' ? 'Error' : 'Warning',
                html: htmlMessage,
                range: range,
                filePath: textEditor.getPath()
              });
            });

            resolve(results);
          });
        });
      }
    };
  }
};

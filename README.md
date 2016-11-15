<!-- @Matt TODO write up readme -->
# linter-slim-lint

This is a Atom linter plugin for [Linter](https://github.com/AtomLinter/Linter) which provides an interface to
[slim-lint](https://github.com/sds/slim-lint), an excellent command-line linter for slim files.

## Installation

The Linter package must be installed. See [here](https://github.com/AtomLinter/Linter).

### `slim-lint` installation

See instructions [here](https://github.com/sds/slim-lint#installation)

### Plugin installation

```shell
apm install linter-slim-lint
```

## Settings

### Command

Set this to the absolute path of your slim-lint executable, defaults to `slim-lint`, which assumes you have it
in your path.

### Config Filename

This is the name of your config file.  This file will be searched for, recursively backwards, from the location of
the file you are currently editing.  Ideally, you can put the config file in your project root or your home folder,
assuming your home folder is in the tree below your current file.  Defaults to `.slim-lint.yml`

# vue-cli-plugin-gh-pages

[![Latest Version on NPM](https://img.shields.io/npm/v/vue-cli-plugin-gh-pages.svg?style=flat-square)](https://npmjs.com/package/vue-cli-plugin-gh-pages)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/vue-cli-plugin-gh-pages.svg?style=flat-square)](https://snyk.io/test/github/JaZo/vue-cli-plugin-gh-pages?targetFile=package.json)

Vue CLI plugin to publish to [GitHub pages](https://pages.github.com/) (or any other branch anywhere else).

## Install

```bash
vue add gh-pages
```

N.B. This plugin requires Git >=1.9.

## Usage

```bash
npm run gh-pages
```

The generator automatically adds this script, however, you are free to modify this.

### Options

This package is a wrapper around [gh-pages](https://github.com/tschaub/gh-pages), so the same options apply to this package. Please see [the documentation of gh-pages](https://github.com/tschaub/gh-pages#options) for a list of supported options. These options must be defined in `vue.config.js` under `pluginOptions.ghPages` e.g.

```js
module.exports = {
    pluginOptions: {
        ghPages: {
            message: 'Updates',
        },
    },
};
```

All options can also be set using the Vue CLI UI. In addition, most options can also be defined on the command line. Please run `npm run gh-pages -- --help` to see a list of supported CLI options.

#### Functions

The `message` and `tag` options can be a function and their return value will be used. This allows you to create, for example, time based commit messages or create a tag based on certain information.

N.B. When these options are defined as a function, they can not be edited using the Vue CLI UI!

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information about what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

### Security

If you discover any security related issues, please contact Jasper Zonneveld directly or [report to NPM](https://www.npmjs.com/advisories/report?package=vue-cli-plugin-gh-pages) instead of using the issue tracker.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

This package is not affiliated with nor endorsed by GitHub. GitHub is a registered trademark of GitHub Inc.

## Credits

- [Jasper Zonneveld](https://github.com/JaZo)
- [All Contributors](../../contributors)

This package is a Vue CLI plugin wrapping [gh-pages](https://github.com/tschaub/gh-pages). Many thanks to [Tim Schaub](https://github.com/tschaub) for his excellent package!

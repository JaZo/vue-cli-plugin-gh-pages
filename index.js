const ghpages = require('gh-pages');

module.exports = (api, projectOptions) => {
    api.registerCommand('gh-pages', {
        description: 'publish to GitHub pages',
        usage: 'vue-cli-service gh-pages [options]',
        options: {
            '-d, --dist <dist>': `Base directory for all source files (default: ${projectOptions.outputDir})`,
            '-s, --src <src>': `Pattern used to select which files to publish (default: ${ghpages.defaults.src})`,
            '-b, --branch <branch>': `Name of the branch you are pushing to (default: ${ghpages.defaults.branch})`,
            '-e, --dest <dest>': `Target directory within the destination branch (relative to the root) (default: ${ghpages.defaults.dest})`,
            '-a, --add': 'Only add, and never remove existing files',
            '-x, --silent': 'Do not output the repository url',
            '-m, --message <message>': `Commit message (default: ${ghpages.defaults.message})`,
            '-g, --tag <tag>': 'Add tag to commit',
            '    --git <git>': `Path to git executable (default: ${ghpages.defaults.git})`,
            '-t, --dotfiles': 'Include dotfiles',
            '-r, --repo <repo>': 'URL of the repository you are pushing to',
            '-p, --depth <depth>': `Depth for clone (default: ${ghpages.defaults.depth})`,
            '-o, --remote <name>': `The name of the remote (default: ${ghpages.defaults.remote})`,
            '-u, --user <address>': 'The name and email of the user (defaults to the git config). Format is "Your Name <email@example.com>".',
            '-v, --remove <pattern>': `Remove files that match the given pattern (ignored if used together with --add). (default: ${ghpages.defaults.only})`,
            '-n, --no-push': 'Commit only (with no push)',
            '    --help': 'Output usage information'
        }
    }, async args => {
        const isFunction = require('lodash.isfunction');
        const pluginOptions = projectOptions.pluginOptions ? projectOptions.pluginOptions.ghPages || {} : {};

        const dir = args.d || args.dist || pluginOptions.dir || projectOptions.outputDir;
        const options = { ...pluginOptions };

        // src
        if (args.s || args.src) {
            options.src = args.s || args.src;
        }

        // branch
        if (args.b || args.branch) {
            options.branch = args.b || args.branch;
        }

        // dest
        if (args.e || args.dest) {
            options.dest = args.e || args.dest;
        }

        // add
        if (args.a || args.add) {
            options.add = Boolean(args.a || args.add);
        }

        // silent
        if (args.x || args.silent) {
            options.silent = Boolean(args.x || args.silent);
        }

        // message
        if (args.m || args.message) {
            options.message = args.m || args.message;
        }
        if (isFunction(options.message)) {
            options.message = await options.message();
        }

        // tag
        if (args.g || args.tag) {
            options.tag = args.g || args.tag;
        }
        if (isFunction(options.tag)) {
            options.tag = await options.tag();
        }

        // git
        if (args.git) {
            options.git = args.git;
        }

        // dotfiles
        if (args.t || args.dotfiles) {
            options.dotfiles = Boolean(args.t || args.dotfiles);
        }

        // repo
        if (args.r || args.repo) {
            options.repo = args.r || args.repo;
        }

        // depth
        if (args.p || args.depth) {
            options.depth = args.p || args.depth;
        }

        // remote
        if (args.o || args.remote) {
            options.remote = args.o || args.remote;
        }

        // user
        if (args.u || args.user) {
            const addr = require('email-addresses');

            const parts = addr.parseOneAddress(args.u || args.user);
            if (!parts) {
                throw new Error(
                    `Could not parse name and email from user option "${args.u || args.user}" ` +
                    '(format should be "Your Name <email@example.com>")'
                );
            }
            options.user = { name: parts.name, email: parts.address };
        }

        // only
        if (args.v || args.remove) {
            options.only = args.v || args.remove;
        }

        // push
        if (args.n) {
            options.push = false;
        } else if (Object.prototype.hasOwnProperty.call(args, 'push')) {
            options.push = args.push;
        }

        await publish(api, api.resolve(dir), options);
    });
};

async function publish (api, dir, options) {
    const path = require('path');
    const { chalk, logger, spinner } = require('@vue/cli-shared-utils');

    logger.log();
    const dirShort = path.relative(api.service.context, dir);
    spinner.logWithSpinner(`Publishing ${chalk.cyan(dirShort)} to GitHub Pages...`);

    return new Promise((resolve, reject) => {
        ghpages.publish(dir, options, err => {
            spinner.stopSpinner(false);
            if (err) {
                return reject(err);
            }

            if (!options.silent) {
                logger.done('Published to GitHub Pages.');
            }

            resolve();
        });
    });
}

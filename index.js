module.exports = (api, projectOptions) => {
    api.registerCommand('gh-pages', {
        description: 'publish to GitHub pages',
        usage: 'vue-cli-service gh-pages [options]',
        options: {
            '-d, --dist <dist>':       `Base directory for all source files (default: ${projectOptions.outputDir})`,
            '-s, --src <src>':         `Pattern used to select which files to publish (default: **/*)`,
            '-b, --branch <branch>':   `Name of the branch you are pushing to (default: gh-pages)`,
            '-e, --dest <dest>':       `Target directory within the destination branch (relative to the root) (default: .)`,
            '-a, --add':               `Only add, and never remove existing files`,
            '-x, --silent':            `Do not output the repository url`,
            '-m, --message <message>': `Commit message (default: Updates)`,
            '-g, --tag <tag>':         `Add tag to commit`,
            '-t, --dotfiles':          `Include dotfiles`,
            '-r, --repo <repo>':       `URL of the repository you are pushing to`,
            '-p, --depth <depth>':     `Depth for clone (default: 1)`,
            '-o, --remote <name>':     `The name of the remote (default: origin)`,
            '-u, --user <address>':    `The name and email of the user (defaults to the git config). Format is "Your Name <email@example.com>".`,
            '-v, --remove <pattern>':  `Remove files that match the given pattern (ignored if used together with --add). (default: .)`,
            '-n, --no-push':           `Commit only (with no push)`,
            '    --help':              `Output usage information`
        }
    }, async args => {
        const isFunction = require('lodash.isfunction');
        const pluginOptions = projectOptions.pluginOptions ? projectOptions.pluginOptions.ghPages || {} : {};

        let dir = args.d || args.dist || pluginOptions.dir || projectOptions.outputDir;

        let user;
        if (args.u || args.user) {
            const addr = require('email-addresses');

            const parts = addr.parseOneAddress(args.u || args.user);
            if (!parts) {
                throw new Error(
                    `Could not parse name and email from user option "${args.u || args.user}" ` +
                    '(format should be "Your Name <email@example.com>")'
                );
            }
            user = {name: parts.name, email: parts.address};
        }

        let options = {
            repo: args.r || args.repo || pluginOptions.repo,
            silent: Boolean(args.x || args.silent || pluginOptions.silent),
            branch: args.b || args.branch || pluginOptions.branch || 'gh-pages',
            src: args.s || args.src || pluginOptions.src || '**/*',
            dest: args.e || args.dest || pluginOptions.dest || '.',
            message: args.m || args.message || pluginOptions.message || 'Updates',
            tag: args.g || args.tag || pluginOptions.tag,
            dotfiles: Boolean(args.t || args.dotfiles || pluginOptions.dotfiles),
            add: Boolean(args.a || args.add || pluginOptions.add),
            only: args.v || args.remove || pluginOptions.only || '.',
            remote: args.o || args.remote || pluginOptions.remote || 'origin',
            push: !Boolean(args.n || (args.hasOwnProperty('push') ? !args.push : false) || (pluginOptions.hasOwnProperty('push') ? !pluginOptions.push : false)),
            depth: args.p || args.depth || pluginOptions.depth || 1,
            user: user || pluginOptions.user,
        };

        if (isFunction(options.message)) {
            options.message = await options.message();
        }

        if (isFunction(options.tag)) {
            options.tag = await options.tag();
        }

        await publish(api, api.resolve(dir), options);
    })
};

async function publish(api, dir, options) {
    const path = require('path');
    const ghpages = require('gh-pages');
    const {chalk, log, done, logWithSpinner, stopSpinner} = require('@vue/cli-shared-utils');

    log();
    const dirShort = path.relative(api.service.context, dir);
    logWithSpinner(`Publishing ${chalk.cyan(dirShort)} to GitHub Pages...`);

    return new Promise((resolve, reject) => {
        ghpages.publish(dir, options, err => {
            stopSpinner(false);
            if (err) {
                return reject(err)
            }

            if (!options.silent) {
                done(`Published to GitHub Pages.`);
            }

            resolve();
        });
    });
}

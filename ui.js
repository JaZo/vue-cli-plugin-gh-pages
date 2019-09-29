const ghpages = require('gh-pages');
const Git = require('gh-pages/lib/git');
const addr = require('email-addresses');
const getUser = require('gh-pages/lib/util').getUser;
const isFunction = require('lodash.isfunction');
const isGitUrl = require('is-git-url');

module.exports = api => {
    const CONFIG = 'com.github.jazo.vue-cli-plugin-gh-pages';

    api.describeConfig({
        id: CONFIG,
        name: 'GitHub pages publish configuration',
        description: 'Publish to GitHub pages',
        link: 'https://www.npmjs.com/package/vue-cli-plugin-gh-pages',
        files: {
            vue: {
                js: ['vue.config.js']
            }
        },
        onRead: async ({ data, cwd }) => {
            const pluginOptions = data.vue.pluginOptions ? data.vue.pluginOptions.ghPages || {} : {};

            const user = await getUser(cwd);
            let repo;
            try {
                const git = new Git(cwd);
                repo = await git.getRemoteUrl('origin');
            } catch (e) {
                // Too bad
            }

            return {
                prompts: [
                    {
                        name: 'dir',
                        type: 'input',
                        default: data.vue.outputDir || 'dist',
                        value: pluginOptions.dir,
                        message: 'Directory',
                        description: 'Base directory for all source files (default: project output directory).'
                    },
                    {
                        name: 'src',
                        type: 'input',
                        default: ghpages.defaults.src,
                        value: pluginOptions.src,
                        message: 'Source',
                        description: 'The minimatch pattern used to select which files should be published.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionssrc'
                    },
                    {
                        name: 'branch',
                        type: 'input',
                        default: ghpages.defaults.branch,
                        value: pluginOptions.branch,
                        message: 'Branch',
                        description: 'The name of the branch you\'ll be pushing to.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsbranch'
                    },
                    {
                        name: 'dest',
                        type: 'input',
                        default: ghpages.defaults.dest,
                        value: pluginOptions.dest,
                        message: 'Destination',
                        description: 'The destination folder (relative to the root) within the destination branch.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsdest'
                    },
                    {
                        name: 'dotfiles',
                        type: 'confirm',
                        default: ghpages.defaults.dotfiles,
                        value: pluginOptions.dotfiles,
                        message: 'Dotfiles',
                        description: 'Include dotfiles.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsdotfiles'
                    },
                    {
                        name: 'add',
                        type: 'confirm',
                        default: ghpages.defaults.add,
                        value: pluginOptions.add,
                        message: 'Add',
                        description: 'Only add, and never remove existing files.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsadd'
                    },
                    {
                        name: 'repo',
                        type: 'input',
                        default: repo,
                        value: pluginOptions.repo,
                        message: 'Repository',
                        description: 'URL of the repository you\'ll be pushing to (default: url for the origin remote of the project dir).',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsrepo',
                        validate (input) {
                            if (!input || isGitUrl(input)) {
                                return true;
                            }

                            return `"${input}" is not a valid repository URL`;
                        }
                    },
                    {
                        name: 'remote',
                        type: 'input',
                        default: ghpages.defaults.remote,
                        value: pluginOptions.remote,
                        message: 'Remote',
                        description: 'The name of the remote you\'ll be pushing to.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsremote'
                    },
                    {
                        name: 'tag',
                        type: 'input',
                        value: !isFunction(pluginOptions.tag) ? pluginOptions.tag : undefined,
                        when: !isFunction(pluginOptions.tag),
                        message: 'Tag',
                        description: 'Create a tag after committing changes on the target branch.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionstag'
                    },
                    {
                        name: 'message',
                        type: 'input',
                        default: ghpages.defaults.message,
                        value: !isFunction(pluginOptions.message) ? pluginOptions.message : undefined,
                        when: !isFunction(pluginOptions.message),
                        message: 'Message',
                        description: 'The commit message for all commits.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsmessage'
                    },
                    {
                        name: 'user',
                        type: 'input',
                        default: user ? `${user.name} <${user.email}>` : undefined,
                        value: pluginOptions.user ? `${pluginOptions.user.name} <${pluginOptions.user.email}>` : undefined,
                        message: 'User',
                        description: 'The name and email of the user (defaults to the git config). Format is "Your Name &lt;email@example.com&gt;".',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsuser',
                        validate (input) {
                            const parts = addr.parseOneAddress(input);
                            if (!input || parts) {
                                return true;
                            }

                            return `Could not parse name and email from "${input}" ` +
                                '(format should be "Your Name <email@example.com>")';
                        }
                    },
                    {
                        name: 'push',
                        type: 'confirm',
                        default: ghpages.defaults.push,
                        value: pluginOptions.push,
                        message: 'Push',
                        description: 'Push branch to remote.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionspush'
                    },
                    {
                        name: 'silent',
                        type: 'confirm',
                        default: ghpages.defaults.silent,
                        value: pluginOptions.silent,
                        message: 'Silent',
                        description: 'Avoid showing repository URLs or other information in errors.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionssilent'
                    },
                    {
                        name: 'git',
                        type: 'input',
                        default: ghpages.defaults.git,
                        value: pluginOptions.git,
                        message: 'Git',
                        description: 'Your git executable.',
                        link: 'https://www.npmjs.com/package/gh-pages#optionsgit'
                    }
                ]
            };
        },
        onWrite: async ({ prompts, answers, data, files, cwd, api }) => {
            const pluginOptions = data.vue.pluginOptions ? data.vue.pluginOptions.ghPages || {} : {};

            const vueData = {};
            for (const prompt of prompts) {
                if (
                    (prompt.id === 'message' && isFunction(pluginOptions.message)) ||
                    (prompt.id === 'tag' && isFunction(pluginOptions.tag))
                ) {
                    continue;
                }

                let answer = await api.getAnswer(prompt.id);

                if (prompt.id === 'repo' && !answer) {
                    answer = undefined;
                }

                if (prompt.id === 'user') {
                    if (answer) {
                        const parts = addr.parseOneAddress(answer);
                        answer = { name: parts.name, email: parts.address };
                    } else {
                        answer = undefined;
                    }
                }

                vueData[`pluginOptions.ghPages.${prompt.id}`] = answer;
            }
            api.setData('vue', vueData);
        }
    });

    api.describeTask({
        match: /vue-cli-service gh-pages/,
        description: 'Publish to GitHub pages',
        link: 'https://www.npmjs.com/package/vue-cli-plugin-gh-pages',
        prompts: [
            {
                name: 'tag',
                type: 'input',
                group: 'These options override the options defined in the config',
                message: 'Tag',
                description: 'Create a tag after committing changes on the target branch.',
                link: 'https://www.npmjs.com/package/gh-pages#optionstag'
            },
            {
                name: 'message',
                type: 'input',
                group: 'These options override the options defined in the config',
                message: 'Message',
                description: 'The commit message.',
                link: 'https://www.npmjs.com/package/gh-pages#optionsmessage'
            },
            {
                name: 'push',
                type: 'confirm',
                group: 'These options override the options defined in the config',
                default: ghpages.defaults.push,
                message: 'Push',
                description: 'Push branch to remote.',
                link: 'https://www.npmjs.com/package/gh-pages#optionspush'
            }
        ],
        onBeforeRun: ({ answers, args }) => {
            if (answers.message) args.push('--message', answers.message);
            if (answers.tag) args.push('--tag', answers.tag);
            if (!answers.push) args.push('--no-push');
        }
    });

    const OPEN_VUE = `${CONFIG}.open-vue`;

    api.onViewOpen(({ view }) => {
        if (view.id !== 'vue-project-configurations') {
            api.removeSuggestion(OPEN_VUE);
        }
    });

    api.onConfigRead(({ config }) => {
        if (config.id === CONFIG) {
            if (config.foundFiles.vue) {
                api.addSuggestion({
                    id: OPEN_VUE,
                    type: 'action',
                    label: 'Open vue config',
                    handler () {
                        const file = config.foundFiles.vue.path;
                        const { launch } = require('@vue/cli-shared-utils');
                        launch(file);
                        return {
                            keep: true
                        };
                    }
                });
            } else {
                api.removeSuggestion(OPEN_VUE);
            }
        } else {
            api.removeSuggestion(OPEN_VUE);
        }
    });
};

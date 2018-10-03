module.exports = (api, projectOptions) => {
    api.registerCommand('gh-pages', args => {
        console.log(args);
        console.log(projectOptions);
    })
};

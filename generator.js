module.exports = (api, options, rootOptions) => {
    api.extendPackage({
        scripts: {
            'gh-pages': 'vue-cli-service gh-pages'
        }
    });
};

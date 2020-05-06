module.exports = function override(config) {
    config.optimization.sideEffects = false;

    return config;
}
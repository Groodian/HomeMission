const { i18n } = require('./next-i18next.config');

module.exports = {
  experimental: {
    outputStandalone: true,
  },

  images: {
    domains: [
      'flagcdn.com',
      's.gravatar.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
    ],
  },

  i18n,

  webpack(config, options) {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
    });

    return config;
  },
};

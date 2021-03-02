const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const settings = {};

module.exports =
  process.env.NODE_ENV === 'development'
    ? settings
    : withPWA({
        ...settings,
        pwa: {
          dest: 'public',
          runtimeCaching,
        },
      });

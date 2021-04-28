const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const settings = {
  future: { webpack5: true },
};

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

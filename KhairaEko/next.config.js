// next.config.js
module.exports = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
    // Tambahkan ini untuk memory management
    workerThreads: true,
    cpus: 2
  },
  webpack: (config, { isServer }) => {
    // Tambahkan handling untuk PDF.js
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Fix memory issue
    config.parallelism = 2;
    config.cache = false;
    
    return config;
  }
};

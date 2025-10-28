/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { webpack }) => {
    // Add polyfills for Node.js modules in browser environment
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
      // Fix MetaMask SDK React Native import issue
      '@react-native-async-storage/async-storage': false,
    }

    // Polyfill global and self for browser compatibility
    config.plugins.push(
      new webpack.DefinePlugin({
        global: 'globalThis',
        self: 'globalThis',
      })
    )

    // Ignore circular dependency warnings from Zama SDK
    config.ignoreWarnings = [/Circular dependency between chunks/]

    return config
  },
}

export default nextConfig
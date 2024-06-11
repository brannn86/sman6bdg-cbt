/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config')

const nextConfig = {
  i18n,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: ['lms.faisaldev.cloud', 'localhost', '127.0.0.1']
  }
}

module.exports = nextConfig

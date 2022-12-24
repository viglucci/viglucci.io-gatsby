import nextMDX from '@next/mdx'
import mdxConfig from './mdx-config.mjs'
import articlesToRedirect from './article-redirects.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['jsx', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    newNextLinkBehavior: true,
    scrollRestoration: true,
  },
  async redirects() {
    return articlesToRedirect.map((slug) => {
      return {
        source: `/${slug}`,
        destination: `/articles/${slug}`,
        permanent: true,
      }
    });
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: mdxConfig,
})

export default withMDX(nextConfig)

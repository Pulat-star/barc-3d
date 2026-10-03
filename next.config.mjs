/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH ?? '/barc-3d'

export default {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  trailingSlash: true
}

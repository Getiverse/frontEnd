const withTM = require("next-transpile-modules")();
/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: [
      "localhost",
      process.env.NEXT_PUBLIC_BACKEDN_DOMAIN,
      "lh3.googleusercontent.com",
      "filestackapi.com",
      "files.portive.com",
    ],
  },
  headers: () => [
    {
      source: "/verification",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store",
          generateEtags: false,
          CacheStorage: false,
        },
      ],
    },
  ],
});

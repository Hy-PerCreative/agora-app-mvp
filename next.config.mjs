/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isGitHubPages ? "/agora-app-mvp" : "",
  assetPrefix: isGitHubPages ? "/agora-app-mvp/" : "",
};

export default nextConfig;

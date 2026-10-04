import path from "node:path";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(import.meta.dirname, "src");
    return config;
  },
};

export default withMDX(config);

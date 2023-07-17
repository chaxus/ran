/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  babel: (options) => {
    return {
      ...options,
      plugins: [
        [
          "babel-plugin-istanbul",
          {
            include: "../stories/**/*.stories.@(js|jsx|ts|tsx)",
            // include: "src/components/**/*.{js,jsx,tsx,(!d).ts}",
          },
        ],
      ],
    };
  },
}
export default config

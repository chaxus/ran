import { Header } from './Header';

export default {
  title: 'Example/Header',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/web-components/vue/writing-docs/autodocs
  tags: ['autodocs'],
  render: (args) => Header(args),
};

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut = {};

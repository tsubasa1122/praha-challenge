// previewでもtailwind.cssを使用するために読み込む
import '../styles/globals.css';

// next/imageをstorybookで使用し、srcにURLを渡すとエラーになる
import * as nextImage from 'next/image';

Object.defineProperty(nextImage, 'default', {
  configurable: true,
  value: (props) => <img {...props} />,
});
//

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

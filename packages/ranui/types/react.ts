import type React from 'react';
import type { NAME_AMP } from '@/components/loading';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'r-loading': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        name: NAME_AMP;
      };
    }
  }
}

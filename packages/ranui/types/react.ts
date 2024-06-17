import { NAME_AMP } from '@/components/loading';
import type React from 'react';


declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-loading': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        name: NAME_AMP
      };
    }
  }
}

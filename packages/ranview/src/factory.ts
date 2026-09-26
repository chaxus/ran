import { ElementBuilder } from './core';
import { createFactories } from './factories';
export const {
  View,
  Div,
  Svg,
  Span,
  Slot,
  ButtonBuilder,
  InputBuilder,
  Style,
  Label,
  Ul,
  Li,
  Section,
  Article,
  Nav,
  Header,
  Footer,
  Main,
  DeclarativeShadow,
} = createFactories(ElementBuilder);

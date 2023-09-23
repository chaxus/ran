/**
 * Copy From https://github.com/BBKolton/reactify-wc/
 * Change to Adaptive ranui
 * */
import { Component, createElement, createRef, forwardRef } from 'react';

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;
const reactifyWebComponent = (
  WC: any,
): React.ForwardRefExoticComponent<
  Omit<any, 'ref'> & React.RefAttributes<unknown>
> => {
  class Reactified extends Component<Props> {
    eventHandlers: any[];
    ref;
    constructor(props: any) {
      super(props);
      this.eventHandlers = [];
      const { innerRef } = props;
      this.ref = innerRef || createRef();
    }

    setEvent(event: string, val: Function) {
      this.eventHandlers.push([event, val]);
      this.ref.current.addEventListener(event, val);
    }

    setProperty(prop: string, val: any) {
      this.ref.current[prop] = val;
    }

    setAttribute(prop: string, val: string | boolean | number) {
      if (val === false) return this.ref.current.removeAttribute(prop);
      this.ref.current.setAttribute(prop, val.toString());
    }

    update() {
      this.clearEventHandlers();
      Object.entries(this.props).forEach(([prop, val]: [string, any]) => {
        // Check to see if we're forcing the value into a type, and don't
        // proceed if we force
        if (prop === 'style') return;
        // We haven't forced the type, so determine the correct typing and
        // assign the value to the right place
        if (prop === 'children') return undefined;
        if (prop.toLowerCase() === 'classname') {
          return (this.ref.current.className = val as string);
        }
        const valTypeList = ['string', 'number', 'boolean'];
        if (valTypeList.includes(typeof val)) {
          this.setProperty(prop, val);
          this.setAttribute(prop, val);
          return;
        }
        if (typeof val === 'function') {
          if (prop.match(/^on[A-Za-z]/)) {
            const eventName = prop.substring(2).toLowerCase();
            return this.setEvent(eventName, val);
          }
        }
        this.setProperty(prop, val);
      });
    }

    componentDidUpdate() {
      this.update();
    }

    componentDidMount() {
      this.update();
    }

    componentWillUnmount() {
      this.clearEventHandlers();
    }

    clearEventHandlers() {
      this.eventHandlers.forEach(([event, handler]) => {
        this.ref.current.removeEventListener(event, handler);
      });
      this.eventHandlers = [];
    }

    render() {
      const { children, className, ...rest } = this.props;
      return createElement(
        WC,
        { class: className, ...rest, ref: this.ref },
        children,
      );
    }
  }

  return forwardRef((props: any, ref: any) => {
    return createElement(Reactified, { ...props, innerRef: ref });
  });
};

export default reactifyWebComponent;

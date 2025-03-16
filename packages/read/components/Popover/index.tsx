import 'ranui/popover';
import { useEffect, useRef } from 'react';
import { EVENT_NAME, synchook } from '@/lib/subscribe';

interface PopoverProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  placement: 'top' | 'left' | 'right' | 'bottom';
  trigger: 'hover' | 'click';
  ref?: React.RefObject<BaseIntrinsicElements['r-popover']> | null;
}

export const Popover = ({ children, overlay, placement, trigger }: PopoverProps): React.JSX.Element => {
  const ref = useRef<BaseIntrinsicElements['r-popover']>(null);

  useEffect(() => {
    synchook.tap(EVENT_NAME.CLOSE_POPOVER, () => {
      ref.current?.closePopover();
    });
  }, []);

  return (
    <div>
      <r-popover placement={placement} trigger={trigger} ref={ref}>
        {children}
        <r-content>
          <div>{overlay}</div>
        </r-content>
      </r-popover>
    </div>
  );
};

import 'ranui/popover';
import { useCallback, useEffect, useRef } from 'react';
import { EVENT_NAME, syncHook } from '@/lib/subscribe';

interface PopoverProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  placement: 'top' | 'left' | 'right' | 'bottom';
  trigger: 'hover' | 'click';
  ref?: React.RefObject<BaseIntrinsicElements['r-popover']> | null;
}

export const Popover = ({ children, overlay, placement, trigger }: PopoverProps): React.JSX.Element => {
  const ref = useRef<BaseIntrinsicElements['r-popover']>(null);

  const closePopover = useCallback(() => {
    ref.current?.closePopover();
  }, []);

  useEffect(() => {
    syncHook.tap(EVENT_NAME.CLOSE_POPOVER, closePopover);
    return () => {
      syncHook.off(EVENT_NAME.CLOSE_POPOVER, closePopover);
    };
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

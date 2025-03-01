

import 'ranui/popover'

interface PopoverProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  placement: 'top' | 'left' | 'right' | 'bottom';
  trigger: 'hover' | 'click';
}

export const Popover = ({ children, overlay, placement, trigger }: PopoverProps): React.JSX.Element => {
  return (
    <div>
      <r-popover placement={placement} trigger={trigger}>
        {children}
        <r-content>
          <div>{overlay}</div>
        </r-content>
      </r-popover>
    </div>
  );
}

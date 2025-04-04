export class FederatedMouseEvent {
    public isTrusted = true;
    public timeStamp = 0;
    public type: keyof FederatedEventMap = 'mousemove';
    public button = 0;
    public buttons = 0;
    public global = new Point();
    public propagationStopped = false;
    public eventPhase = EventPhase.NONE;
    public target = new Container();
    public currentTarget = new Container();
  
    public stopPropagation(): void {
      this.propagationStopped = true;
    }
  }

export type FederatedEventMap = {
    mousedown: FederatedMouseEvent;
    mouseup: FederatedMouseEvent;
    click: FederatedMouseEvent;
    mouseenter: FederatedMouseEvent;
    mouseleave: FederatedMouseEvent;
    mousemove: FederatedMouseEvent;
    mouseout: FederatedMouseEvent;
    mouseover: FederatedMouseEvent;
  };
  
  export type Cursor =
    | 'auto'
    | 'default'
    | 'none'
    | 'context-menu'
    | 'help'
    | 'pointer'
    | 'progress'
    | 'wait'
    | 'cell'
    | 'crosshair'
    | 'text'
    | 'vertical-text'
    | 'alias'
    | 'copy'
    | 'move'
    | 'no-drop'
    | 'not-allowed'
    | 'e-resize'
    | 'n-resize'
    | 'ne-resize'
    | 'nw-resize'
    | 's-resize'
    | 'se-resize'
    | 'sw-resize'
    | 'w-resize'
    | 'ns-resize'
    | 'ew-resize'
    | 'nesw-resize'
    | 'col-resize'
    | 'nwse-resize'
    | 'row-resize'
    | 'all-scroll'
    | 'zoom-in'
    | 'zoom-out'
    | 'grab'
    | 'grabbing';
  
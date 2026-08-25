import { isMobile, range, throttle } from 'ranuts/utils';
import selectCss from './index.less?inline';
import chevronDownIcon from '@/assets/icons/chevron-down.svg?raw';
import { RanElement, isDisabled } from '@/utils/index';
import '@/components/select/option';
import '@/components/dropdown';
import '@/components/select/dropdown-item';
import { registerIcon } from '@/components/icon';
import { defineSSR } from '@/utils/ssr-registry';
import { FloatingController } from '@/utils/floating';
import type { Placement } from '@/utils/placement';
import '@/components/input';
import { createRef, Div, EventManager, InputBuilder, Label, Slot, Span, View } from '@/utils/builder';
import {
  ensureShadowRoot,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { checkInternalsValidity, isActivationKey, reportInternalsValidity, updateRequiredValidity } from '@/utils/a11y';

interface Option {
  label: string | number;
  value: string | number;
  disabled?: boolean;
}

// The dropdown caret is part of the select's own chrome, so the component
// registers its icon itself rather than relying on the consumer to do it.
// Outline/stroke style (matching r-icon's other self-registered core glyphs —
// copy/check/download etc. — not the filled 1024-grid builtin set), since a
// solid filled triangle reads heavier than the thin caret every mainstream
// implementation (Radix, GitHub Primer, Vercel Geist) uses for this affordance.
registerIcon('chevron-down', chevronDownIcon);

// Monotonic id source so each select's rendered <label> can point its
// `for`/aria-labelledby at a stable id (mirrors r-input's inputIdSeq).
let selectIdSeq = 0;

/**
 * @fires show - The panel is about to appear.
 * @fires after-show - The panel has appeared and any entrance animation has finished.
 * @fires hide - The panel is about to close.
 * @fires after-hide - The panel has closed and any exit animation has finished.
 */
export class Select extends RanElement {
  // Participate in native forms: the selected value is host state, so relay it via
  // ElementInternals so `new FormData(form)` collects it.
  static formAssociated = true;
  _internals?: ElementInternals;
  _events = new EventManager();
  // Search listeners are (re)wired reactively as `showSearch` toggles, so they
  // live in their own manager that can be aborted independently of _events.
  _searchEvents = new EventManager();
  removeTimeId?: NodeJS.Timeout;
  _listboxId: string;
  _activeIndex: number;
  _slot: HTMLSlotElement;
  _shadowDom: ShadowRoot;
  _select: HTMLDivElement;
  _selection: HTMLDivElement;
  _search: HTMLInputElement;
  _icon: HTMLElement;
  _selectDropdown?: HTMLDivElement;
  _selectionDropdown?: HTMLElement;
  /**
   * Positioning, portalling, scroll-following, the enter/exit animation and the
   * show/hide events all live in the shared controller — r-popover drives the
   * same one, so the two cannot drift apart the way their hand-copied
   * reposition listeners had begun to.
   */
  _floating = new FloatingController({
    host: this,
    panel: () => this._selectionDropdown,
    placement: () => this.placement,
    offset: 4,
    containerId: () => this.getPopupContainerId,
    // The panel host tracks the trigger's width, and it has to be set before the
    // panel is measured: the flip decision reads a height that depends on it.
    beforeMeasure: (anchorRect, panel) => {
      panel.style.setProperty('width', `${anchorRect.width}px`);
    },
    // A consumer can widen the panel *inside* that host (`::part(dropdown)`),
    // and the overflow is invisible to a measurement taken on the host — so
    // align and flip against what is actually painted. See r-player's quality
    // menu, whose trigger is far narrower than its options.
    measurePanel: (panel) => {
      const shadow = (panel as unknown as { _shadowDom?: ShadowRoot })._shadowDom;
      const rendered = shadow?.querySelector<HTMLElement>('.ranui-dropdown')?.getBoundingClientRect();
      const own = panel.getBoundingClientRect();
      return { width: rendered?.width ?? own.width, height: rendered?.height ?? own.height };
    },
  });
  _optionList: Option[];
  _optionLabelMapValue: Map<string, string>;
  _optionValueMapLabel: Map<string, string>;
  _activeOption?: HTMLElement;
  _text: HTMLSpanElement;
  _selector: HTMLDivElement;
  _label: HTMLLabelElement | undefined;
  onSearch?: (this: HTMLElement, ev: Event) => unknown;
  // WAI-ARIA combobox type-ahead: accumulated recently-typed characters, reset
  // after a pause between keystrokes.
  _typeaheadBuffer = '';
  _typeaheadTimeId?: NodeJS.Timeout;
  static get observedAttributes(): string[] {
    return [
      'disabled',
      'required',
      'sheet',
      'type',
      'value',
      'label',
      // Attribute names are lowercased by the DOM, so these MUST be lowercase to
      // be observed — the previous camelCase entries never fired (which is why
      // defaultValue/showSearch used to apply only on first connect).
      'defaultvalue',
      'showsearch',
      'open', // whether the dropdown is showing — the single source of truth
      'placement', // 弹窗的方向
      'getpopupcontainerid', // 挂载的节点——同上，必须小写才会被观察到
      'dropdownclass', // 弹窗的类名
      'trigger', // 触发下拉框的行为，click 还是 hover，hover 在 isMobile 移动端无效
    ];
  }
  constructor() {
    super();
    // attachInternals is allowed in the constructor; guard for SSR/old runtimes.
    try {
      this._internals = this.attachInternals();
    } catch {
      this._internals = undefined;
    }
    this._listboxId = `ran-select-listbox-${Math.random().toString(36).slice(2, 9)}`;
    this._activeIndex = -1;
    this._optionList = [];
    this._optionLabelMapValue = new Map();
    this._optionValueMapLabel = new Map();

    this._shadowDom = ensureShadowRoot(this, selectCss);
    const selectionRef = createRef<HTMLDivElement>();
    const selectorRef = createRef<HTMLDivElement>();
    const iconRef = createRef<HTMLElement>();
    const textRef = createRef<HTMLSpanElement>();
    const searchRef = createRef<HTMLInputElement>();
    const slotRef = createRef<HTMLSlotElement>();
    const wrap = Div()
      .class('ran-select')
      .part('select')
      .children(
        Div()
          .class('selection')
          .ref(selectionRef)
          .part('selection')
          .children(
            View('r-icon')
              .class('icon')
              .ref(iconRef)
              .part('icon')
              .attr('name', 'chevron-down')
              .attr('color', 'var(--ran-color-text-secondary)')
              .attr('size', '16'),
            Div()
              .ref(selectorRef)
              .children(
                Span().class('selection-item').ref(textRef).part('selection-item'),
                InputBuilder()
                  .class('selection-search')
                  .ref(searchRef)
                  .part('search')
                  .attr('type', 'search')
                  .attr('autocomplete', 'off'),
              ),
          ),
        Slot().ref(slotRef).class('slot'),
      )
      .build() as HTMLDivElement;
    this._shadowDom.appendChild(wrap);

    this._select = wrap;
    this._selection = shadowPart(selectionRef, 'selection');
    this._selector = shadowPart(selectorRef, 'selector');
    this._icon = shadowPart(iconRef, 'icon');
    this._text = shadowPart(textRef, 'selection item');
    this._search = shadowPart(searchRef, 'selection search');
    this._slot = shadowPart(slotRef, 'slot');
  }
  get value(): string {
    return this.getAttribute('value') || '';
  }
  set value(value: string) {
    // Native <select> allows its value to be set/restored programmatically
    // (including from formResetCallback) regardless of `disabled` — disabled
    // only blocks *user* interaction, not assignment. Gating this on
    // `!isDisabled(this)` used to silently drop formResetCallback's restore
    // whenever the field happened to be disabled at reset time.
    if (value) {
      this.setAttribute('value', value);
    } else {
      this.removeAttribute('value');
    }
    this.syncFormValue();
  }
  // Relay the selected value to the associated form (guarded — jsdom omits it).
  syncFormValue = (): void => {
    this._internals?.setFormValue?.(this.value);
    this._updateValidity();
  };
  get required(): boolean {
    return this.hasAttribute('required');
  }
  set required(value: boolean | string) {
    setBooleanAttribute(this, 'required', !(!value || value === 'false'));
  }
  /**
   * @description: 获取字段上方的静态说明文字（label）。
   */
  get label(): string {
    return this.getAttribute('label') || '';
  }
  /**
   * @description: 设置字段上方的静态说明文字（label）。
   */
  set label(value: string) {
    this.setAttribute('label', value);
  }
  /**
   * A static caption above the field — same pattern as r-input's `label`
   * (see input/index.ts `listenLabel`), so a labeled select and a labeled
   * input placed side by side in a form line up: same token, same "renders
   * above, reserves its own space, never overlaps" behavior. Associated via
   * `aria-label` (plain text) rather than `aria-labelledby` pointing at the
   * rendered `<label>`'s id: that label lives inside this select's own shadow
   * root, and a plain `aria-labelledby` id-ref cannot cross into a shadow
   * tree — even the host's own child shadow root counts as a separate tree.
   * Verified directly: with `aria-labelledby`, the combobox's computed
   * accessible name came back empty in the accessibility tree.
   */
  private _syncLabel = (value: string | null): void => {
    if (value != null) {
      if (this._label) {
        this._label.innerHTML = value;
      } else {
        if (!this.id) this.id = `ran-select-${++selectIdSeq}`;
        this._label = Label().class('ran-select-label').part('label').text(value).build() as HTMLLabelElement;
        this._label.id = `${this.id}-label`;
        this._label.addEventListener('click', () => this.focus());
        this._shadowDom.insertBefore(this._label, this._select);
      }
      this.setAttribute('aria-label', value);
    } else if (this._label) {
      this._label.remove();
      this._label = undefined;
      this.removeAttribute('aria-label');
    }
  };
  /**
   * Lets `required` be seen by form.checkValidity()/reportValidity()/:invalid,
   * and mirrors it into aria-required/aria-invalid for assistive tech.
   * Disabled selects never block submission, matching native semantics.
   */
  private _updateValidity = (): void => {
    updateRequiredValidity(this, this._internals, {
      disabled: this.disabled,
      required: this.required,
      isEmpty: !this.value,
      message: 'Please select an item in the list.',
      // The host itself is the focusable/tabbable element (tabIndex is set on
      // `this`, never on `_selection`) — the native validation bubble anchors
      // correctly only against a focusable descendant.
      anchor: this,
    });
  };
  checkValidity(): boolean {
    return checkInternalsValidity(this._internals);
  }
  reportValidity(): boolean {
    return reportInternalsValidity(this._internals);
  }
  get validity(): ValidityState | undefined {
    return this._internals?.validity;
  }
  get validationMessage(): string {
    return this._internals?.validationMessage ?? '';
  }
  /**
   * @description: 原生 form.reset() 时恢复到 defaultValue（若有）或清空选中项
   */
  formResetCallback(): void {
    const fallback = this.defaultValue;
    if (fallback) {
      this.value = fallback;
      return;
    }
    this.removeAttribute('value');
    this._text.textContent = '';
    this._text.removeAttribute('title');
    if (this._activeOption) {
      this._activeOption.removeAttribute('active');
      this._activeOption.setAttribute('aria-selected', 'false');
      this._activeOption = undefined;
    }
    this._activeIndex = -1;
    this.syncActiveState();
    this.syncFormValue();
  }
  get defaultValue(): string {
    return this.getAttribute('defaultValue') || '';
  }
  set defaultValue(value: string) {
    this.setAttribute('defaultValue', value || '');
  }
  get showSearch(): string {
    return this.getAttribute('showSearch') || '';
  }
  set showSearch(value: string) {
    this.setAttribute('showSearch', value || '');
  }
  get type(): string {
    return this.getAttribute('type') || '';
  }
  set type(value: string) {
    this.setAttribute('type', value || '');
  }
  /**
   * Which side of the trigger the panel opens on, with an optional alignment.
   *
   * `bottom`, `bottom-end`, `top-center`, … — the same grammar r-popover takes,
   * because both now position through the same controller. A bare side means
   * `-start`. Typed rather than left as `string`: these are the values the
   * positioner understands, and an editor should say so.
   */
  get placement(): Placement {
    return (this.getAttribute('placement') || 'bottom') as Placement;
  }
  set placement(value: Placement) {
    this.setAttribute('placement', value || '');
  }
  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }
  get getPopupContainerId(): string {
    return this.getAttribute('getPopupContainerId') || '';
  }
  set getPopupContainerId(value: string) {
    this.setAttribute('getPopupContainerId', value || '');
  }
  get dropdownclass(): string {
    return this.getAttribute('dropdownclass') || '';
  }
  set dropdownclass(value: string) {
    this.setAttribute('dropdownclass', value || '');
  }
  get trigger(): string {
    return this.getAttribute('trigger') || 'click';
  }
  set trigger(value: string) {
    this.setAttribute('trigger', value || '');
  }
  get disabled(): boolean {
    return isDisabled(this);
  }
  set disabled(value: boolean | string | undefined | null) {
    if (!value || value === 'false') {
      this.removeAttribute('disabled');
      this._selection.removeAttribute('disabled');
      this.removeAttribute('aria-disabled');
      // Don't clobber a consumer-set custom tabindex — but a tabindex of -1 here can
      // only be *our own* disabled-state assignment (see the enable branch below and
      // attributeChangedCallback's 'disabled' handling), so that case must still reset.
      if (this.tabIndex < 0 || !this.hasAttribute('tabindex')) this.tabIndex = 0;
    } else {
      this.setAttribute('disabled', '');
      this._selection.setAttribute('disabled', '');
      this.setAttribute('aria-disabled', 'true');
      this.tabIndex = -1;
    }
  }

  initAria = (): void => {
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
    this.setAttribute('role', 'combobox');
    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-controls', this._listboxId);
    this.setAttribute('aria-expanded', 'false');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  };

  updateAriaExpanded = (isExpanded: boolean): void => {
    this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  };

  /**
   * Whether the dropdown is showing.
   *
   * This attribute *is* the state; nothing else infers it. The panel's
   * `style.display` cannot serve that purpose because it lags the state by the
   * length of the exit animation, and every read of it during that window
   * answers about the frame rather than the intent. Reflecting it the way
   * `<details open>` and `<dialog open>` do also puts the state where a
   * consumer can reach it: `:host([open])` in CSS, `select.open = true` from
   * script, and an attribute assertion in a test instead of a poll.
   */
  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(value: boolean) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  /** Drive the panel from `open`. Everything below it is the controller's. */
  _applyOpen = (): void => {
    this._floating.apply(this.open);
  };

  /** Open the dropdown. */
  show = (): void => {
    this.open = true;
  };

  /** Close the dropdown. */
  hide = (): void => {
    this.open = false;
  };

  /** Flip the dropdown between open and closed. */
  toggle = (): void => {
    this.open = !this.open;
  };

  getDropdownOptions = (): HTMLElement[] => {
    if (!this._selectionDropdown) return [];
    // runtime children: r-dropdown-item elements are appended from `options` as it changes,
    // so the live set is the only source — see `renderOptions`.
    return Array.from(this._selectionDropdown.querySelectorAll('r-dropdown-item')) as HTMLElement[];
  };

  syncActiveState = (): void => {
    const options = this.getDropdownOptions();
    options.forEach((item, index) => {
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', item === this._activeOption ? 'true' : 'false');
      if (!item.id) {
        item.id = `${this._listboxId}-option-${index}`;
      }
    });
    if (this._activeOption?.id) {
      this.setAttribute('aria-activedescendant', this._activeOption.id);
    } else {
      this.removeAttribute('aria-activedescendant');
    }
  };

  setActiveOptionByIndex = (targetIndex: number): void => {
    const options = this.getDropdownOptions();
    if (options.length === 0) return;
    const normalizedIndex = range(targetIndex, 0, options.length - 1);
    const next = options[normalizedIndex];
    if (!next) return;
    if (this._activeOption && this._activeOption !== next) {
      this._activeOption.removeAttribute('active');
      this._activeOption.setAttribute('aria-selected', 'false');
    }
    this._activeIndex = normalizedIndex;
    this._activeOption = next;
    const activeValue = next.getAttribute('value') || '';
    next.setAttribute('active', activeValue);
    next.setAttribute('aria-selected', 'true');
    next.scrollIntoView({ block: 'nearest' });
    this.syncActiveState();
  };

  /**
   * Vertically center the closed-state label by matching its line-height to the
   * host height.
   *
   * Guarded on a non-zero height: during a custom-element **upgrade** (SSR/DSD
   * markup, or any element whose `value` attribute is present before it is laid
   * out) `attributeChangedCallback` runs before `connectedCallback`, so
   * `getBoundingClientRect()` still reports 0. Writing `line-height: 0px` then
   * collapses the label to invisible even though its text is correct — the
   * component looks empty until something re-selects the option. When there is
   * no layout yet we clear the inline value and let the stylesheet decide;
   * `connectedCallback` re-applies it once the element has a box.
   */
  applyLabelLineHeight = (): void => {
    if (!this._text) return;
    const { height } = this.getBoundingClientRect();
    if (height > 0) {
      this._text.style.setProperty('line-height', `${height}px`);
    } else {
      this._text.style.removeProperty('line-height');
    }
  };

  selectOptionElement = (optionElement: HTMLElement | null, shouldDispatch = true): void => {
    if (!optionElement) return;
    const label = optionElement.getAttribute('title') || optionElement.textContent?.trim() || '';
    const value = optionElement.getAttribute('value') || this._optionLabelMapValue.get(label) || '';
    if (!value) return;
    this.setAttribute('value', value);
    this.syncFormValue();
    this._text.textContent = label;
    this._text.setAttribute('title', label);
    this._search.setAttribute('placeholder', label);
    this.applyLabelLineHeight();
    if (this._activeOption && this._activeOption !== optionElement) {
      this._activeOption.removeAttribute('active');
      this._activeOption.setAttribute('aria-selected', 'false');
    }
    this._activeOption = optionElement;
    this._activeIndex = this.getDropdownOptions().findIndex((item) => item === optionElement);
    optionElement.setAttribute('active', value);
    optionElement.setAttribute('aria-selected', 'true');
    this.syncActiveState();
    this.setSelectDropdownDisplayNone();
    if (shouldDispatch) {
      this.dispatchEvent(new CustomEvent('change', { detail: { value, label } }));
    }
  };

  isDropdownOpen = (): boolean => {
    if (!this._selectionDropdown) return false;
    return this._selectionDropdown.style.display === 'block';
  };

  /**
   * Walk from `from` in the direction of `step` (clamped to the list bounds)
   * and return the first non-disabled option index, or -1 if none exists.
   * Keeps keyboard navigation from ever landing on a disabled option.
   */
  _nextEnabledIndex = (from: number, step: number): number => {
    const options = this.getDropdownOptions();
    const count = options.length;
    if (count === 0) return -1;
    let index = range(from, 0, count - 1);
    for (let i = 0; i < count; i++) {
      if (!isDisabled(options[index])) return index;
      const next = index + step;
      if (next < 0 || next > count - 1) return -1;
      index = next;
    }
    return -1;
  };

  keydownSelect = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!this.isDropdownOpen()) {
        this.selectMouseDown(e);
      }
      const options = this.getDropdownOptions();
      if (options.length === 0) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      // Nothing active yet: land on the first option going down / last option
      // going up, instead of stepping from an implied index 0 — which made the
      // very first ArrowDown skip straight past option 0 to option 1.
      const target =
        this._activeIndex >= 0
          ? this._nextEnabledIndex(this._activeIndex + step, step)
          : this._nextEnabledIndex(step > 0 ? 0 : options.length - 1, step);
      if (target >= 0) this.setActiveOptionByIndex(target);
      return;
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      if (!this.isDropdownOpen()) {
        this.selectMouseDown(e);
      }
      const options = this.getDropdownOptions();
      if (options.length === 0) return;
      const step = e.key === 'Home' ? 1 : -1;
      const target = this._nextEnabledIndex(e.key === 'Home' ? 0 : options.length - 1, step);
      if (target >= 0) this.setActiveOptionByIndex(target);
      return;
    }
    if (isActivationKey(e)) {
      e.preventDefault();
      if (!this.isDropdownOpen()) {
        this.selectMouseDown(e);
        return;
      }
      if (this._activeOption) {
        this.selectOptionElement(this._activeOption);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      this.setSelectDropdownDisplayNone();
      return;
    }
    this._handleTypeahead(e);
  };
  /**
   * WAI-ARIA combobox type-ahead: typing a printable character jumps to the
   * next option (wrapping) whose label starts with the recently-typed
   * characters, matching the behavior of a native `<select>`.
   */
  _handleTypeahead = (e: KeyboardEvent): void => {
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    if (!this.isDropdownOpen()) this.selectMouseDown(e);
    const options = this.getDropdownOptions();
    const count = options.length;
    if (count === 0) return;
    clearTimeout(this._typeaheadTimeId);
    this._typeaheadBuffer += e.key.toLowerCase();
    this._typeaheadTimeId = setTimeout(() => {
      this._typeaheadBuffer = '';
    }, 500);
    const start = this._activeIndex >= 0 ? this._activeIndex + 1 : 0;
    for (let i = 0; i < count; i++) {
      const index = (start + i) % count;
      const option = options[index];
      if (isDisabled(option)) continue;
      const label = (option.getAttribute('title') || option.textContent || '').trim().toLowerCase();
      if (label.startsWith(this._typeaheadBuffer)) {
        this.setActiveOptionByIndex(index);
        return;
      }
    }
  };
  handlerExternalCss(): void {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  }
  /**
   * @description: 移除 select dropdown
   * @return {*}
   */
  setSelectDropdownDisplayNone = (): void => {
    this.open = false;
  };
  /**
   * @description: 添加 select dropdown
   * @return {*}
   */
  setSelectDropdownDisplayBlock = (): void => {
    this.open = true;
  };
  /**
   * Position the panel against the trigger.
   *
   * Kept as a method because it is part of this element's surface, but the work
   * is the shared controller's — including staying with the trigger when the
   * page scrolls, which this component and r-popover used to implement
   * separately, one carrying a comment that it mirrored the other.
   *
   * @param applyEntranceTransit - Only true for the call that opens the panel.
   * Scroll/resize repositioning reuses this while already open and must not
   * replay the entrance animation on every tick.
   */
  placementPosition = (applyEntranceTransit = false): void => {
    this._floating.position(applyEntranceTransit);
  };
  /**
   * @description: 设置下拉框
   * @return {*}
   */
  /**
   * Toggle, not close-then-open. The old body ran both transitions on every
   * click and let the surviving one depend on which animation timer happened to
   * be in flight, so a run of clicks on a stationary pointer produced: open,
   * close, open-and-immediately-close, and an `aria-expanded` that had come
   * apart from what was on screen.
   */
  selectMouseDown = (e: Event): void => {
    e.stopPropagation();
    if (isDisabled(this)) return;
    this.removeDropDownTimeId(e);
    this.open = !this.open;
  };
  removeDropDownTimeId = (e: Event): void => {
    e.stopPropagation();
    // The property, not the attribute: once the user has typed, the input's value is dirty
    // and no longer tracks `value=`, so setting the attribute leaves the search box filled.
    this._search.value = '';
    if (this.trigger.includes('hover') && !isMobile()) {
      clearTimeout(this.removeTimeId);
      this.removeTimeId = undefined;
    }
  };
  /**
   * @description: 焦点移除的情况，需要移除 select 下拉框
   * @return {*}
   */
  selectBlur = (e: Event): void => {
    e.stopPropagation();
    if (this.removeTimeId) {
      this.removeDropDownTimeId(e);
    }
    this.removeTimeId = setTimeout(() => {
      this.removeDropDownTimeId(e);
      this.setSelectDropdownDisplayNone();
    }, 300);
  };
  /**
   * @description: 选中一个选项的情况
   * @param {MouseEvent} e
   * @return {*}
   */
  clickOption = (e: MouseEvent): void => {
    e.stopPropagation();
    const element = (e.target as Element).closest('r-dropdown-item') as HTMLElement | null;
    // Disabled options are non-selectable, matching native <select> semantics.
    if (element && isDisabled(element)) {
      this.removeDropDownTimeId(e);
      return;
    }
    this.selectOptionElement(element);
    this.removeDropDownTimeId(e);
    // The clicked option is portaled to <body> and isn't itself focusable, so the
    // browser's default mousedown-focus-shift behavior moves focus to <body> —
    // unlike keyboard-driven selection, which never left the host. Reclaim it so
    // mouse and keyboard selection leave the control in the same focused state.
    this.focus();
  };
  /**
   * @description: 初始化创建选项下拉框
   * @return {*}
   */
  createOption = (): void => {
    if (!this._selectDropdown) {
      const root = this.getRootNode() as ShadowRoot | Document;
      const container =
        (root.getElementById ? root.getElementById(this.getPopupContainerId) : null) ||
        document.getElementById(this.getPopupContainerId) ||
        document.body;
      this._selectDropdown = Div()
        .style('-webkit-tap-highlight-color', 'transparent')
        .style('outline', '0')
        .on('click', this.clickOption)
        .build() as HTMLDivElement;

      this._selectionDropdown = View('r-dropdown')
        .id(this._listboxId)
        .attr('role', 'listbox')
        .style('position', 'absolute')
        .style('display', 'none')
        .build() as HTMLElement;

      if (this.dropdownclass) {
        this._selectionDropdown.setAttribute('class', this.dropdownclass);
      }
      if (this.trigger.includes('hover') && !isMobile()) {
        this._selectDropdown.addEventListener('mouseleave', this.selectBlur);
        this._selectDropdown.addEventListener('mouseenter', this.removeDropDownTimeId);
      }
      this._selectDropdown.appendChild(this._selectionDropdown);
      container.appendChild(this._selectDropdown);
    }
  };
  /**
   * @description: 移除选项下拉框
   * @return {*}
   */
  removeSelectDropdown = (): void => {
    try {
      if (this._selectDropdown) {
        const root = this.getRootNode() as ShadowRoot | Document;
        const container =
          (root.getElementById ? root.getElementById(this.getPopupContainerId) : null) ||
          document.getElementById(this.getPopupContainerId) ||
          document.body;
        if (container && this._selectDropdown.parentNode === container) {
          container.removeChild(this._selectDropdown);
        }
      }
    } catch (error) {
      console.error('removeSelectDropdown error', error);
    }
  };
  /**
   * @description: 当 select 中有 option 元素的时候，给 dropdown 添加元素
   * @return {*}
   */
  addOptionToSlot = (): void => {
    this._optionList = [];
    this._optionLabelMapValue.clear();
    this._optionValueMapLabel.clear();
    const slots = this._slot.assignedElements();
    slots.forEach((item) => {
      if (item.tagName !== 'R-OPTION') return;
      const label = item.innerHTML;
      const value = item.getAttribute('value') || '';
      const disabled = isDisabled(item);
      this._optionList?.push({ label, value, disabled });
      if (this._optionLabelMapValue.get(label)) {
        console.warn(`${label} is repeat option`);
      }
      if (this._optionValueMapLabel.get(value)) {
        console.warn(`${value} is repeat option`);
      }
      this._optionLabelMapValue.set(label, value);
      this._optionValueMapLabel.set(value, label);
    });
    this.createSelectDropdownContent(this._optionList);
    // Options populated asynchronously (e.g. after a fetch) can arrive while
    // the dropdown is already open. placementPosition()'s flip decision reads
    // `_selectionDropdown.clientHeight`, which was 0 (no options yet) the
    // first time it ran, so a select near the viewport edge never flipped.
    // Re-run it now that the panel has real content/height.
    if (this._selectionDropdown?.style.display === 'block') this.placementPosition();
  };
  createSelectDropdownContent = (options: Option[] = []): void => {
    if (options.length === 0) {
      this._selectDropdown?.style.setProperty('display', 'none');
    } else {
      this._selectDropdown?.style.setProperty('display', 'block');
    }
    if (this._selectionDropdown) {
      this._selectionDropdown.innerHTML = '';
      this._activeOption = undefined;
      this._activeIndex = -1;
    }
    options.forEach((item) => {
      if (this._selectionDropdown) {
        const { label, value, disabled } = item;
        const selectOptionItem = View('r-dropdown-item')
          .attr('role', 'option')
          .attr('value', `${value}`)
          .attr('title', `${label}`)
          .text(`${label}`)
          .build() as HTMLElement;
        // Carry the disabled state onto the rendered item so click/keyboard
        // selection can skip it and assistive tech announces it.
        if (disabled) {
          selectOptionItem.setAttribute('disabled', '');
          selectOptionItem.setAttribute('aria-disabled', 'true');
        }
        const defaultValue = this.getAttribute('defaultValue') || this.getAttribute('value');
        if (defaultValue === value) {
          selectOptionItem.setAttribute('active', value);
          this._activeOption = selectOptionItem;
        } else {
          selectOptionItem.removeAttribute('active');
        }
        this._selectionDropdown.appendChild(selectOptionItem);
      }
    });
    this._activeIndex = this.getDropdownOptions().findIndex((item) => item === this._activeOption);
    this.syncActiveState();
    this.setDefaultValue();
  };
  setDefaultValue = (): void => {
    const defaultValue = this.getAttribute('defaultValue') || this.getAttribute('value');
    if (!defaultValue) return;
    const label = this._optionValueMapLabel.get(defaultValue);
    if (!label) return;
    this.setAttribute('value', defaultValue);
    this._text.textContent = label;
    this._text.setAttribute('title', label);
    this.applyLabelLineHeight();
    const options = this.getDropdownOptions();
    const target = options.find((item) => item.getAttribute('value') === defaultValue) || null;
    if (target) {
      this.selectOptionElement(target, false);
    }
  };
  changeSearch = (e: Event): void => {
    const value = (e as CustomEvent).detail.value || '';
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { value },
      }),
    );
    if (this._selectionDropdown) {
      this._selectionDropdown.innerHTML = '';
    }
    if (value.length > 0) {
      const options = this._optionList
        .map((item) => {
          const { label } = item;
          if (`${label}`.toLowerCase().includes(value)) {
            return { label, value: item.value, disabled: item.disabled };
          }
          return undefined;
        })
        .filter((item) => item);
      this.createSelectDropdownContent(options as Option[]);
    } else {
      this.createSelectDropdownContent(this._optionList);
    }
  };
  clickRemoveSelect = (e: Event): void => {
    e.stopPropagation();
    this.setSelectDropdownDisplayNone();
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this.createOption();
    this.initAria();
    this.syncFormValue(); // seed the form value from any initial selection
    this._events
      .on(this._slot, 'slotchange', this.addOptionToSlot)
      .on(this, 'keydown', this.keydownSelect)
      .on(document, 'click', this.clickRemoveSelect);
    if (this.trigger.includes('hover') && !isMobile()) {
      this._events.on(this, 'mouseenter', this.selectMouseDown).on(this, 'mouseleave', this.selectBlur);
    }
    if (this.trigger.includes('click')) {
      this._events.on(this, 'click', this.selectMouseDown).on(this, 'blur', this.selectBlur);
    }
    this._applyShowSearch();
    // SSR / declarative shadow DOM: the `value` attribute is already present at
    // upgrade time, so `syncSelectedFromValue` ran *before* this callback — with
    // no layout and no dropdown built yet. Re-apply it here, now that the element
    // is connected, so the closed-state label and the active option are correct.
    this.reapplyValueAfterConnect();
    // `<r-select open>` in markup: the attribute was set before the dropdown
    // existed, so its attributeChangedCallback had nothing to act on.
    if (this.open) this._applyOpen();
  }

  /**
   * Re-run the `value` → label/active-option reflection after connect.
   *
   * `syncSelectedFromValue` bails out when `_activeOption` already matches, which
   * is exactly the situation left behind by an upgrade-time sync: the option was
   * marked active but the label was written without layout. Clearing the cached
   * option first forces a full, correct pass.
   */
  reapplyValueAfterConnect = (): void => {
    const value = this.getAttribute('value');
    if (!value) return;
    this._activeOption = undefined;
    this.syncSelectedFromValue(value);
    this.applyLabelLineHeight();
  };
  /**
   * (Re)wire the search-box listeners to match the current `showSearch` value.
   * Reactive: abort any previously-registered search listeners first, then
   * re-register only while `showSearch` is truthy. Safe to call on connect and
   * on every `showSearch` attribute change.
   */
  _applyShowSearch = (): void => {
    this._searchEvents.abort();
    if (this.showSearch) {
      this.onSearch = throttle(this.changeSearch);
      if (this.onSearch) {
        this._searchEvents.on(this._search, 'change', this.onSearch).on(this._search, 'click', this.onSearch);
      }
    }
  };
  disconnectedCallback(): void {
    this._events.abort();
    this._searchEvents.abort();
    this._floating.destroy();
    this.removeSelectDropdown();
    clearTimeout(this._typeaheadTimeId);
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'disabled' && this._select) {
      // `newValue` is the raw attribute string — for the standard boolean-attribute form
      // `<r-select disabled>` that's `''`, which `!newValue` (the old check) treated as
      // falsy and wrongly took the "not disabled" branch. Read the actual current state via
      // the `disabled` getter (isDisabled/falseList) instead of re-deriving it from the string.
      if (this.disabled) {
        this._select.setAttribute('disabled', '');
        this._selection.setAttribute('disabled', '');
        this.setAttribute('aria-disabled', 'true');
        this.tabIndex = -1;
      } else {
        this._select.removeAttribute('disabled');
        this._selection.removeAttribute('disabled');
        this.removeAttribute('aria-disabled');
        if (this.tabIndex < 0 || !this.hasAttribute('tabindex')) this.tabIndex = 0;
      }
    }
    if (name === 'value') this.syncSelectedFromValue(newValue);
    if (name === 'required' || name === 'disabled') this._updateValidity();
    if (name === 'sheet' && this._shadowDom) this.handlerExternalCss();
    if (name === 'label' && this._shadowDom) this._syncLabel(newValue);
    // Reactive: `defaultValue` and `showSearch` used to apply only on first
    // connect. Re-run the same effect their initial-connect code performs when
    // they change afterwards.
    if (name === 'defaultvalue') this.setDefaultValue();
    if (name === 'showsearch' && this._search) this._applyShowSearch();
    if (name === 'open') this._applyOpen();
  }

  /**
   * Reflect a programmatic `value` change to the closed-state label. Lets
   * `select.value = 'x'` (or setAttribute('value', 'x')) update the displayed
   * selection without the consumer having to "nudge" the active option.
   */
  syncSelectedFromValue = (value: string): void => {
    if (!value) return;
    // Already reflected (e.g. the change came from selectOptionElement itself).
    if (this._activeOption?.getAttribute('value') === value) return;
    const option = Array.from(this.querySelectorAll('r-option')).find(
      (item) => item.getAttribute('value') === value,
    ) as HTMLElement | undefined;
    if (option) this.selectOptionElement(option, false);
  };
}

defineSSR('r-select', Select as unknown as new () => HTMLElement);
export default Select;

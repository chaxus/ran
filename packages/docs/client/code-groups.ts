/** Upgrade readable, complete server-rendered examples into keyboard-accessible tabs. */
export const mountCodeGroups = (): void => {
  document.querySelectorAll<HTMLElement>('.code-group').forEach((group, groupIndex) => {
    if (group.dataset.enhanced) return;
    const tabs = [...group.querySelectorAll<HTMLButtonElement>('.code-group__tab')];
    const panes = [...group.querySelectorAll<HTMLElement>('.code-group__pane')];
    if (!tabs.length || tabs.length !== panes.length) return;
    const list = group.querySelector<HTMLElement>('.code-group__tabs')!;
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', tabs.map((tab) => tab.textContent).join(', '));
    const select = (index: number, focus = false): void => {
      tabs.forEach((tab, i) => {
        tab.tabIndex = i === index ? 0 : -1;
        tab.setAttribute('aria-selected', String(i === index));
        panes[i].hidden = i !== index;
      });
      if (focus) {
        tabs[index].focus();
        tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      }
    };
    tabs.forEach((tab, i) => {
      const id = `code-group-${groupIndex}-${i}`;
      tab.hidden = false;
      tab.id = `${id}-tab`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `${id}-panel`);
      panes[i].id = `${id}-panel`;
      panes[i].setAttribute('role', 'tabpanel');
      panes[i].setAttribute('aria-labelledby', tab.id);
      panes[i].tabIndex = 0;
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (event) => {
        let next: number;
        switch (event.key) {
          case 'ArrowRight':
            next = (i + 1) % tabs.length;
            break;
          case 'ArrowLeft':
            next = (i + tabs.length - 1) % tabs.length;
            break;
          case 'Home':
            next = 0;
            break;
          case 'End':
            next = tabs.length - 1;
            break;
          default:
            return;
        }
        event.preventDefault();
        select(next, true);
      });
    });
    group.dataset.enhanced = 'true';
    select(0);
  });
};

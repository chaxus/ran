import 'ranui/button';
import { scenario, payload, streamPayload } from '../runtime.js';
const app = document.querySelector('#app');
const back = '<a data-return="project" href="#project">Back to project</a>';
function render() {
  if (location.hash === '#project' || location.hash === '#workspace') {
    app.innerHTML = `<main>${location.hash === '#project' ? '<nav><a href="#workspace">Back to workspace</a></nav>' : ''}<h1>${location.hash === '#project' ? 'Project' : 'Workspace'}</h1><a href="#detail">Open settings</a></main>`;
    return;
  }
  let content = '';
  if (scenario === '01-text')
    content =
      '<h1>Settings</h1><section class="setting"><div><h2><span class="heading-text">Notifications</span></h2><p><span class="description-text">Choose how you hear from us.</span></p></div><r-button>Manage</r-button></section>';
  if (scenario === '02-back')
    content = `<nav><a data-return="workspace" href="#workspace">Back to workspace</a></nav><h1>Project settings</h1><nav class="detail-nav">${back}${back}</nav><p>Manage the project configuration.</p>`;
  if (scenario === '03-label')
    content =
      '<nav><a data-return="project" href="#project"><span class="return-label">Zurück zu Projekteinstellungen</span></a></nav><h1>Benachrichtigungen</h1><p>Einstellungen für dieses Projekt.</p>';
  if (scenario === '04-effects')
    content =
      '<div class="premium"><div class="frame"><h1>Recent activity</h1><div class="frame"><h2>Project updated</h2><div class="frame"><p>Mia changed the workspace description.</p><r-button>View activity</r-button></div></div></div></div>';
  if (scenario === '05-freshness')
    content =
      '<h1>Workspace settings</h1><section class="setting"><div><h2>Activity</h2><p>Workspace updates and notifications.</p></div><r-button>Manage</r-button></section>';
  if (scenario === '06-code')
    content =
      '<h1>Quick start</h1><section class="code-frame"><button id="copy">Copy code</button><button id="stream">Receive update</button><pre tabindex="0"><code id="source"></code></pre></section>';
  app.innerHTML = `<main>${content}</main>`;
  if (scenario === '06-code') {
    let raw = payload;
    const source = document.querySelector('#source');
    const display = () => {
      source.textContent = raw.replace(/\t/g, '  ').trim();
    };
    display();
    document.querySelector('#copy').onclick = () => navigator.clipboard.writeText(source.textContent);
    document.querySelector('#stream').onclick = () => {
      raw += streamPayload;
      display();
    };
  }
}
window.addEventListener('hashchange', render);
render();

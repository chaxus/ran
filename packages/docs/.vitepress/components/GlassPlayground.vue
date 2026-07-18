<template>
  <div class="gp">
    <!-- live stage: a colorful backdrop so the frost/refraction is visible -->
    <div class="gp-stage" ref="stage">
      <div class="gp-bg" aria-hidden="true">
        <span>Aa</span>
        <b>ranui</b>
        <i>glass</i>
      </div>

      <r-glass
        v-if="mounted"
        ref="glassEl"
        class="gp-glass"
        :style="{ left: pos.x + 'px', top: pos.y + 'px', width: width + 'px' }"
        :blur="String(blur)"
        :saturate="String(saturate)"
        :displace="String(displace)"
        :radius="String(radius)"
        :sheen="sheen ? '' : null"
        :interactive="interactive ? '' : null"
        @pointerdown="startDrag"
      >
        <div class="gp-card">
          <div class="gp-card-title">Frosted panel</div>
          <div class="gp-card-sub">drag me · tune the knobs</div>
        </div>
      </r-glass>
    </div>

    <!-- controls -->
    <div class="gp-panel">
      <div class="gp-rows">
        <label class="gp-row" v-for="s in sliders" :key="s.key">
          <span class="gp-label">{{ s.label }}</span>
          <input type="range" :min="s.min" :max="s.max" :step="s.step" v-model.number="state[s.key]" />
          <span class="gp-val">{{ state[s.key] }}{{ s.unit }}</span>
        </label>
        <div class="gp-row gp-toggles">
          <label class="gp-check"><input type="checkbox" v-model="sheen" /> sheen</label>
          <label class="gp-check"><input type="checkbox" v-model="interactive" /> interactive</label>
          <button class="gp-reset" @click="reset">Reset</button>
        </div>
      </div>

      <!-- copyable code, reflects the live params -->
      <div class="gp-code">
        <button class="gp-copy" :class="{ done: copied }" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
        <pre><code>{{ code }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue';

const mounted = ref(false);
onMounted(() => (mounted.value = true));

const defaults = { blur: 16, saturate: 180, displace: 8, radius: 24, width: 300 };
const state = reactive({ ...defaults });
const { blur, saturate, displace, radius, width } = toRefs(state);
const sheen = ref(false);
const interactive = ref(false);

const sliders = [
  { key: 'blur', label: 'blur', min: 0, max: 40, step: 1, unit: 'px' },
  { key: 'saturate', label: 'saturate', min: 100, max: 260, step: 5, unit: '%' },
  { key: 'displace', label: 'displace', min: 0, max: 80, step: 1, unit: '' },
  { key: 'radius', label: 'radius', min: 0, max: 48, step: 1, unit: 'px' },
  { key: 'width', label: 'width', min: 180, max: 460, step: 10, unit: 'px' },
] as const;

const reset = () => {
  Object.assign(state, defaults);
  sheen.value = false;
  interactive.value = false;
};

// ---- drag within the stage ----
const stage = ref<HTMLElement | null>(null);
const glassEl = ref<HTMLElement | null>(null);
const pos = reactive({ x: 40, y: 40 });
let dragging = false;
let offX = 0;
let offY = 0;

const startDrag = (e: PointerEvent) => {
  const el = glassEl.value as HTMLElement | null;
  if (!el) return;
  dragging = true;
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  offX = e.clientX - pos.x;
  offY = e.clientY - pos.y;
  window.addEventListener('pointermove', onDrag);
  window.addEventListener('pointerup', endDrag);
};
const onDrag = (e: PointerEvent) => {
  if (!dragging || !stage.value || !glassEl.value) return;
  const s = stage.value.getBoundingClientRect();
  const g = glassEl.value.getBoundingClientRect();
  pos.x = Math.max(0, Math.min(e.clientX - offX, s.width - g.width));
  pos.y = Math.max(0, Math.min(e.clientY - offY, s.height - g.height));
};
const endDrag = () => {
  dragging = false;
  window.removeEventListener('pointermove', onDrag);
  window.removeEventListener('pointerup', endDrag);
};
onBeforeUnmount(endDrag);

// ---- generated markup ----
const code = computed(() => {
  const attrs = [
    blur.value !== defaults.blur ? `blur="${blur.value}"` : '',
    saturate.value !== defaults.saturate ? `saturate="${saturate.value}"` : '',
    `displace="${displace.value}"`,
    radius.value !== defaults.radius ? `radius="${radius.value}"` : '',
    sheen.value ? 'sheen' : '',
    interactive.value ? 'interactive' : '',
  ].filter(Boolean);
  const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
  return `<r-glass${attrStr}>\n  <div class="panel">…</div>\n</r-glass>`;
});

const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;
const copy = async () => {
  try {
    await navigator.clipboard?.writeText?.(code.value);
  } catch {
    /* ignore */
  }
  copied.value = true;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => (copied.value = false), 1600);
};
onBeforeUnmount(() => clearTimeout(copyTimer));
</script>

<style scoped>
.gp {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 16px;
  margin: 22px 0;
}
@media (max-width: 720px) {
  .gp {
    grid-template-columns: 1fr;
  }
}

/* ---- stage ---- */
.gp-stage {
  position: relative;
  min-height: 320px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  touch-action: none;
}
.gp-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(40% 55% at 22% 26%, #ff5f6d, transparent 60%),
    radial-gradient(45% 55% at 80% 30%, #22d3ee, transparent 60%),
    radial-gradient(55% 60% at 55% 88%, #a855f7, transparent 60%),
    radial-gradient(40% 45% at 12% 82%, #f9d423, transparent 55%), #0b0d16;
}
.gp-bg span,
.gp-bg b,
.gp-bg i {
  position: absolute;
  color: rgba(255, 255, 255, 0.85);
  mix-blend-mode: overlay;
  font-style: normal;
  font-weight: 800;
}
.gp-bg span {
  top: 8%;
  right: 10%;
  font-size: 68px;
}
.gp-bg b {
  bottom: 12%;
  left: 8%;
  font-size: 84px;
  letter-spacing: -0.04em;
}
.gp-bg i {
  top: 44%;
  left: 40%;
  font-size: 40px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.7;
}

.gp-glass {
  position: absolute;
  cursor: grab;
  touch-action: none;
}
.gp-glass:active {
  cursor: grabbing;
}
.gp-card {
  padding: 20px 22px;
  color: #fff;
}
.gp-card-title {
  font-size: 17px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
}
.gp-card-sub {
  font-size: 12.5px;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.8);
}

/* ---- control panel ---- */
.gp-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}
.gp-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.gp-row {
  display: grid;
  grid-template-columns: 74px 1fr 52px;
  align-items: center;
  gap: 10px;
}
.gp-label {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.gp-row input[type='range'] {
  width: 100%;
  accent-color: var(--vp-c-brand);
}
.gp-val {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-1);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.gp-toggles {
  display: flex;
  gap: 16px;
  align-items: center;
  grid-template-columns: none;
  padding-top: 4px;
  border-top: 1px solid var(--vp-c-divider);
}
.gp-check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.gp-check input {
  accent-color: var(--vp-c-brand);
}
.gp-reset {
  margin-left: auto;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 7px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.gp-reset:hover {
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-1);
}

/* ---- code ---- */
.gp-code {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
}
.gp-code pre {
  margin: 0;
  padding: 16px 18px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}
.gp-copy {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11.5px;
  padding: 4px 12px;
  border-radius: 7px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.gp-copy.done {
  color: var(--ran-color-success, #28a948);
  border-color: color-mix(in srgb, var(--ran-color-success, #28a948) 45%, transparent);
}
</style>

<template>
  <div>
    <h3>Move the mouse over the icon to see the loading animation</h3>
    <div v-for="item of list">
      <div class="loading">
        <div>{{ item }}</div>
        <div class="loading-icon">
          <r-loading :name="item"></r-loading>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import "ranui"

const list = ref([
  "stretch",
  "rotate",
  "double-bounce",
  "cube",
  "dot",
  "triple-bounce",
  "scale-out",
  "circle",
  "circle-line",
  "square",
  "pulse",
  "solar",
  "cube-fold",
  "circle-fold",
  "cube-grid",
  "circle-turn",
  "circle-rotate",
  "circle-spin",
  "dot-bar",
  "dot-circle",
  "line",
  "dot-pulse",
  "line-scale",
  "text",
  "cube-dim",
  "dot-line",
  "arc",
  "drop",
  "pacman",
])
</script>
<style lang="less">
.loading {
  border-radius: 8px;
  border: 1px solid #ebeef5;
  height: 500px;
  &-icon {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    r-loading {
      --loading-stretch-div-animation-play-state: paused;
      --loading-rotate-div-animation-play-state: paused;
      --loading-double-bounce1-animation-play-state: paused;
      --loading-double-bounce2-animation-play-state: paused;
      --loading-cube1-animation-play-state: paused;
      --loading-cube2-animation-play-state: paused;
      --loading-dot-animation-play-state: paused;
      --loading-dot1-animation-play-state: paused;
      --loading-dot2-animation-play-state: paused;
      --loading-triple-bounce-div-animation-play-state: paused;
      --loading-scale-out-animation-play-state: paused;
      --loading-circle-container-div-animation-play-state: paused;
      --loading-circle-line-border-animation-play-state: paused;
      --loading-square-box1-animation-play-state: paused;
      --loading-square-box2-animation-play-state: paused;
      --loading-pulse-bubble-1-animation-play-state: paused;
      --loading-pulse-bubble-2-animation-play-state: paused;
      --loading-pulse-bubble-3-animation-play-state: paused;
      --loading-solar-earth-orbit-animation-play-state: paused;
      --loading-solar-venus-orbit-animation-play-state: paused;
      --loading-solar-mercury-orbit-animation-play-state: paused;
      --loading-cube-fold-item-before-animation-play-state: paused;
      --loading-circle-fold-item-before-animation-play-state: paused;
      --loading-cube-grid-item-animation-play-state: paused;
      --loading-circle-turn-animation-play-state: paused;
      --loading-circle-rotate-outer-animation-play-state: paused;
      --loading-circle-rotate-inner-animation-play-state: paused;
      --loading-circle-spin-inner-animation-play-state: paused;
      --loading-circle-spin-outer-animation-play-state: paused;
      --loading-dot-bar-item-animation-play-state: paused;
      --loading-dot-circle-item-1-animation-play-state: paused;
      --loading-dot-circle-item-2-animation-play-state: paused;
      --loading-dot-circle-item-3-animation-play-state: paused;
      --loading-dot-circle-item-4-animation-play-state: paused;
      --loading-dot-circle-item-5-animation-play-state: paused;
      --loading-line-item-animation-play-state: paused;
      --loading-dot-pulse-item-dot-animation-play-state: paused;
      --loading-dot-pulse-item-ball-animation-play-state: paused;
      --loading-line-scale-item-animation-play-state: paused;
      --loading-text-item-animation-play-state: paused;
      --loading-cube-dim-item-animation-play-state: paused;
      --loading-dot-line-item-animation-play-state: paused;
      --loading-arc-item-animation-play-state: paused;
      --loading-arc-item-after-animation-play-state: paused;
      --loading-arc-h1-after-animation-play-state: paused;
      --loading-drop-item-animation-play-state: paused;
      --loading-drop-dot-animation-play-state: paused;
      --loading-drop-dot-2-animation-play-state: paused;
      --loading-pacman-div-nth-child-2-animation-play-state: paused;
      --loading-pacman-div-nth-child-3-animation-play-state: paused;
      --loading-pacman-div-nth-child-4-animation-play-state: paused;
      --loading-pacman-div-nth-child-5-animation-play-state: paused;
      --loading-pacman-div-first-of-type-animation-play-state: paused;
      --loading-arc-item-before-animation-play-state: paused;
    }
    &:hover {
      r-loading {
        --loading-stretch-div-animation-play-state: running;
        --loading-rotate-div-animation-play-state: running;
        --loading-double-bounce1-animation-play-state: running;
        --loading-double-bounce2-animation-play-state: running;
        --loading-cube1-animation-play-state: running;
        --loading-cube2-animation-play-state: running;
        --loading-dot-animation-play-state: running;
        --loading-dot1-animation-play-state: running;
        --loading-dot2-animation-play-state: running;
        --loading-triple-bounce-div-animation-play-state: running;
        --loading-scale-out-animation-play-state: running;
        --loading-circle-container-div-animation-play-state: running;
        --loading-circle-line-border-animation-play-state: running;
        --loading-square-box1-animation-play-state: running;
        --loading-square-box2-animation-play-state: running;
        --loading-pulse-bubble-1-animation-play-state: running;
        --loading-pulse-bubble-2-animation-play-state: running;
        --loading-pulse-bubble-3-animation-play-state: running;
        --loading-solar-earth-orbit-animation-play-state: running;
        --loading-solar-venus-orbit-animation-play-state: running;
        --loading-solar-mercury-orbit-animation-play-state: running;
        --loading-cube-fold-item-before-animation-play-state: running;
        --loading-circle-fold-item-before-animation-play-state: running;
        --loading-cube-grid-item-animation-play-state: running;
        --loading-circle-turn-animation-play-state: running;
        --loading-circle-rotate-outer-animation-play-state: running;
        --loading-circle-rotate-inner-animation-play-state: running;
        --loading-circle-spin-inner-animation-play-state: running;
        --loading-circle-spin-outer-animation-play-state: running;
        --loading-dot-bar-item-animation-play-state: running;
        --loading-dot-circle-item-1-animation-play-state: running;
        --loading-dot-circle-item-2-animation-play-state: running;
        --loading-dot-circle-item-3-animation-play-state: running;
        --loading-dot-circle-item-4-animation-play-state: running;
        --loading-dot-circle-item-5-animation-play-state: running;
        --loading-line-item-animation-play-state: running;
        --loading-dot-pulse-item-dot-animation-play-state: running;
        --loading-dot-pulse-item-ball-animation-play-state: running;
        --loading-line-scale-item-animation-play-state: running;
        --loading-text-item-animation-play-state: running;
        --loading-cube-dim-item-animation-play-state: running;
        --loading-dot-line-item-animation-play-state: running;
        --loading-arc-item-animation-play-state: running;
        --loading-arc-item-after-animation-play-state: running;
        --loading-arc-h1-after-animation-play-state: running;
        --loading-drop-item-animation-play-state: running;
        --loading-drop-dot-animation-play-state: running;
        --loading-drop-dot-2-animation-play-state: running;
        --loading-pacman-div-nth-child-2-animation-play-state: running;
        --loading-pacman-div-nth-child-3-animation-play-state: running;
        --loading-pacman-div-nth-child-4-animation-play-state: running;
        --loading-pacman-div-nth-child-5-animation-play-state: running;
        --loading-pacman-div-first-of-type-animation-play-state: running;
        --loading-arc-item-before-animation-play-state: running;
      }
    }
  }
}
</style>

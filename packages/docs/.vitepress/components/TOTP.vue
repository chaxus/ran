<template>
  <div>
    <div class="totp-desc">{{ t('components_totp_6') }}</div>
    <div class="totp-row">
      <div class="totp-field">
        <r-input :label="t('components_totp_2')" class="totp-input" :status="inputStatus" @input="onChange"></r-input>
        <div class="totp-error" v-if="inputStatus === INPUT_STATUS.ERROR">
          {{ errorMessage }}
        </div>
      </div>
      <r-button class="totp-btn" @click="clickButton">{{ t('components_totp_1') }}</r-button>
    </div>

    <div class="totp-output">
      <div>code: {{ outputValue.code }}</div>
      <div>{{ t('components_totp_4') }}: {{ outputValue.expires }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { INPUT_STATUS } from '../lib/constant';
import { ref } from 'vue';
import useBasic from '../composition/useBasic';
import { TOTP, timestampToTime } from 'ranuts/utils';

const { t, $env, locale } = useBasic();

// 输入框的值
const inputValue = ref('');
// 输入框的状态
const inputStatus = ref(INPUT_STATUS.NORMAL);
// 错误的文本提示
const errorMessage = ref('');
// 点击按钮输出的结果
const outputValue = ref({
  code: '',
  expires: '',
});
/**
 * @description: 监听输入框的变化
 * @param {*} e
 */
const onChange = (e: { detail: { value: string } }) => {
  inputValue.value = e.detail.value;
  inputStatus.value = INPUT_STATUS.NORMAL;
};

/**
 * @description: 点击生成结果
 * @return {*}
 */
const clickButton = () => {
  // 没有输入的情况
  if (inputValue.value.length <= 0) {
    errorMessage.value = t('components_totp_3');
    inputStatus.value = INPUT_STATUS.ERROR;
  } else {
    try {
      const { otp, expires } = TOTP.generate(inputValue.value);
      outputValue.value.code = otp;
      outputValue.value.expires = timestampToTime(expires).format();
    } catch (error) {
      errorMessage.value = t('components_totp_5');
      inputStatus.value = INPUT_STATUS.ERROR;
    }
  }
};
</script>

<style scoped>
.totp-desc {
  margin-top: 8px;
  font-size: 16px;
  color: var(--vp-c-text-2);
}
.totp-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  margin-top: 16px;
}
.totp-field {
  position: relative;
  height: 56px;
}
.totp-input {
  display: block;
  width: 256px;
  height: 32px;
  font-size: 18px;
  border-radius: 8px;
}
.totp-error {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 14px;
  color: var(--vp-c-danger-1, #ff4d4f);
}
.totp-btn {
  height: 32px;
}
.totp-output {
  margin-top: 24px;
  font-size: 16px;
  color: var(--vp-c-brand-1, #3451b2);
}
</style>

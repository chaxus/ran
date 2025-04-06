<template>
  <div>
    <div class="text-slate-600 text-base mt-2">{{ t('components_totp_6') }}</div>
    <div class="flex flex-row justify-start items-start mt-4">
      <div class="relative h-14">
        <r-input
          :label="t('components_totp_2')"
          class="w-64 h-8 rounded-lg block text-lg"
          :status="inputStatus"
          @input="onChange"
        ></r-input>
        <div class="absolute bottom-0 left-0 text-sm text-[#ff4d4f]" v-if="inputStatus === INPUT_STATUS.ERROR">
          {{ errorMessage }}
        </div>
      </div>
      <r-button class="ml-1 h-8" @click="clickButton">{{ t('components_totp_1') }}</r-button>
    </div>

    <div class="text-[#3451b2] text-base mt-6">
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

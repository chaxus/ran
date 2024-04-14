<template>
  <div>
    <r-input
      :label="t('components_totp_2')"
      class="m-6"
      :status="inputStatus"
      @input="onChange"
    ></r-input>
    <div v-if="inputStatus === INPUT_STATUS.ERROR">{{ errorMessage }}</div>
    <r-button @click="clickButton">{{ t("components_totp_1") }}</r-button>
    <div>{{ outputValue }}</div>
  </div>
</template>
<script lang="ts" setup>
import { INPUT_STATUS } from "../lib/constant";
import { ref } from "vue";
import useBasic from "../composition/useBasic";
import { TOTP, timestampToTime } from "ranuts/utils";

const { t, $env, locale } = useBasic();

// 输入框的值
const inputValue = ref("");
// 输入框的状态
const inputStatus = ref(INPUT_STATUS.NORMAL);
// 错误的文本提示
const errorMessage = ref("");
// 点击按钮输出的结果
const outputValue = ref("");
/**
 * @description: 监听输入框的变化
 * @param {*} e
 */
const onChange = (e) => {
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
      outputValue.value = `code: ${otp} ${t('components_totp_4')}: ${timestampToTime(
        expires
      ).format()}`;
    } catch (error) {
      errorMessage.value = t('components_totp_5');
      inputStatus.value = INPUT_STATUS.ERROR;
    }
  }
};
</script>

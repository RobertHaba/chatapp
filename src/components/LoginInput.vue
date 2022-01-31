<template>
  <div class="flex flex-col gap-1 mb-2">
    <label for="loginUser" class="text-white font-semibold text-xs">{{
      inputObj.title
    }}</label>
    <input
      class="text-black rounded-lg py-2 px-4 font-bold"
      :type="inputObj.type"
      :id="inputObj.id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="inputObj.placeholder"
      :minlength="inputObj.minLength"
      :maxlength="inputObj.maxlength"
      @keyup="inputValidation"
    />
    <p class="text-xs" v-show="inputObj.showError">{{ inputObj.errorMsg }}</p>
  </div>
</template>

<script>
import { onMounted } from '@vue/runtime-core';
export default {
  props:{
    inputObj:Object,
    modelValue:String
  },
  emits: ['update:modelValue'],
  setup(props) {
      const inputValidation = ()=>{
        if(props.modelValue && props.modelValue.length >= props.inputObj.minLength && props.modelValue.length <= props.inputObj.maxLength){
          props.inputObj.isValid = true
          props.inputObj.showError = false
        }
        else{
          props.inputObj.isValid = false
        }
      }
      onMounted(()=>{
        if(props.modelValue){
          inputValidation()
        }
      })
    return {inputValidation}
  },
};
</script>

<style lang="scss" scoped></style>

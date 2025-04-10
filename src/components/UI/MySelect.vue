<template>
    <select 
      class="select" 
      :value="modelValue" 
      @change="handleChange"
    >
        <option class="option-txt" disabled value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.name }}
        </option>
    </select>
</template>

<script>
export default {
    name: 'my-select',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: 'Выберите из списка'
        }
    },
    methods: {
        handleChange(event) {
            this.$emit('update:modelValue', event.target.value);
        }
    }
}
</script>

<style scoped>
.select {
    width: 150px;
    height: 40px;
    border: 2px solid teal;
    cursor: pointer;
    color: teal;
    background: none;
    border-radius: 5px;
    padding: 0 10px;
    font-size: 14px;
}

.option-txt {
    color: gray;
    opacity: 0.7;
}

@media(max-width:1380px) {
    .select {
        width: 185px;
    }
}
</style>
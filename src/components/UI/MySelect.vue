<template>
    <select class="select" :value="modelValue" @change="changeOption">
        <option class="option-txt" disabled value="">Выберите из списка</option>
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
export default{
    name: 'my-select',
    props:{
        modelValue:{
            type: String
        },
        options:{
            type: Array,
            default: () => []
        }
    },
    methods:{
        changeOption(event){
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
</script>

<style scoped>
.select{
    width: 150px;
    height: 40px;
    border:  2px solid teal;
    cursor: pointer;
    color: teal;
    background: none;
    border-radius: 5px;
}
.option-txt{
    color: gray;
    opacity: 0.7;
}
@media(max-width:1380px){
    .select{
      width: 185px;
    }
  }
</style>
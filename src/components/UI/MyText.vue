<template>
   <textarea
    :value="modelValue"
    @input="updateInput"
    class="textarea"
    type="text"
    ></textarea>
</template>

<script>
export default {
    name:'my-text',
    props:{
        modelValue: [String, Number]
    },
    methods:{
        updateInput(event){
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
</script>

<style scoped>
.textarea{
    display: flex;
    flex-direction: column;
    width: 100%;
    border:  2px solid teal;
    padding: 10px 15px;
    margin-top: 20px;
    border-radius: 10px;
    }
</style>
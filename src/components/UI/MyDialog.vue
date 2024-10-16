<template>
    <div class="dialog" v-if="show === true" @click.stop="hideDialog">
        <div @click.stop class="dialog_content">
            <slot></slot>
        </div>
        
    </div>
</template>
<script>
export default {
    name: "my-dialog",
    props: {
        show: {
            type: Boolean,
            default: false
        },
    },
    methods:{
        hideDialog() {
            this.$emit('update:show', false)
        },
        }
}
</script>
<style  scoped>
    .dialog{
        position: fixed;
        display: flex;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }
    .dialog_content{
        margin: auto;
        background:white;
        border-radius: 12px;
        min-width: 400px;
        min-height: 50px;
        padding: 20px;
    }
  @media(max-width: 500px){
    .dialog_content{
        min-width: 250px;
        padding: 12px;
    }
  }
</style>
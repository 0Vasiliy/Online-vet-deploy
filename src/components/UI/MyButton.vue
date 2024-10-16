<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script>

export default {
 name: 'my-button'
}

</script>

<style scoped>
   .btn{
      display: block;
      width: 150px;
      height: 40px;
      border:  2px solid teal;
      cursor: pointer;
      color: teal;
      background: none;
      border-radius: 5px;
}
@media(max-width:1150px){
.btn{
  width: 185px;
}
}

</style>
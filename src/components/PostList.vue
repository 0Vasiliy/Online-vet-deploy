<template>
  <div class="post-list" v-show="posts.length > 0" >
    <h3>Список клиентов</h3>
    <TransitionGroup name="list">
    <PostItem 
      v-for="post in posts"
      :post="post"
      :key="post.id"
      @remove="$emit('remove',post.id)"
      >  
  </PostItem>
  </TransitionGroup>
  </div>
  <h2 v-show="posts.length === 0">
      Список клиентов пуст
  </h2>
</template>

<script>
import PostItem from './PostItem.vue';

export default {
  components: {PostItem},
  props: {
    posts:{
      type: Array,
      require: true
    }
  },
}
</script>

<style scoped>
.post-list{
  color: gray;
}
.btn_mini{
  color:brown;
  width: 50px;
  height: 50px;
}
   h3{
    margin-top: 20px;
    font-size: 24px;
  }
  h2{
    color: red;
    display: block;
  }
  @media(max-width:1150px){
    .post-list{
    display: flex;
    flex-direction: column;
    align-items: center;
    width:100%;
    }
  }
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.6s ease;
}
</style>


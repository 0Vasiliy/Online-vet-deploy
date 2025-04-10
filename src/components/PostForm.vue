<template>
  <form @submit.prevent>
    <div class="form-header">
      <h4>Запись на приём</h4>
      <my-button class="close-btn" @click="$emit('close')">×</my-button>
    </div>
    <my-input
      class="form-input"
      name="surname"
      v-focus
      v-model="post.surname"
      type="text"
      placeholder="Фамилия">
    </my-input>
    <my-input
      class="form-input"
      name="name"
      v-model="post.name"
      type="text"
      placeholder="Имя">
    </my-input>
      <my-input
      class="form-input"
      name="email"
      v-model="post.email"
      type="text"
      placeholder="Эл.почта">
    </my-input>
      <my-input
      class="form-input"
      name="phone"
      v-model="post.phone"
      type="text"
      v-maska="'+7(###)-###-##-##'"
      placeholder="+7(000)-000-00-00">
    </my-input>
    <my-text 
      name="body"
      v-model="post.body"
      type="text"
      placeholder="Описание">
    </my-text>
    <my-input
      class="form-input"
      name="date"
      v-model="post.date"
      type="date"
      placeholder="Дата">
    </my-input>
      <my-input
      class="form-input"
      name="time"
      v-model="post.time"
      type="text"
      v-maska="'##-##'"
      placeholder="ЧЧ-MM">
    </my-input>    
      <div class="postform_btns">
        <my-button @click="createPost" type="submit">Создать</my-button>
      </div>
  </form>
</template>
<script setup>
  import { vMaska } from "maska/vue"
</script>

<script>
import axios from 'axios' 
import MyButton from './UI/MyButton.vue';
import MyInput from './UI/MyInput.vue';
import MyText from './UI/MyText.vue';


export default {
  components:{
    MyButton,
    MyInput,
    MyText
  },
    data() {
        return {
            post: {
              surname: "",
              name: "",
              email: "",
              phone: "",
              body: "",
              date: "",
              time: "",
            },
        };
    },
    methods: {
        async createPost() {
          try {
            this.post.id = Date.now();
            this.post.createdAt = new Date().toISOString();
            await this.fetchPostsPost();
            this.$emit("create", this.post);
            // Очищаем форму
            this.post = {
              surname: "",
              name: "",
              email: "",
              phone: "",
              body: "",
              date: "",
              time: "",
            };
            // Закрываем модальное окно
            this.$emit('close');
          } catch (error) {
            console.error('Error creating post:', error);
          }
        },
        async fetchPostsPost(){     
          try {
            const response = await axios.post(
              'https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
              this.post
            );
            console.log('Post created successfully:', response);
          } catch (error) {
            console.error('Error creating post:', error);
            throw error;
          }
        },
     },
    components: { MyInput }
}
</script>

<style scoped>
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .close-btn {
    width: 30px;
    height: 30px;
    padding: 0;
    font-size: 24px;
    line-height: 1;
    border-radius: 50%;
    background-color: #f44336;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
  }
  .close-btn:hover {
    background-color: #d32f2f;
  }
  h4{
    font-size: 24px;
    margin: 0;
  }
  .postform_btns{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .form-input{
    margin-top: 20px;
    width: 100%;
  }
  @media(max-width: 500px){
    .form-input{
      height: 35px;
    }
  }
 
</style>

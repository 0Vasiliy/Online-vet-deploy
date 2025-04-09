<template>
  <form @submit.prevent>
      <h4>Запись на приём</h4>
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
        createPost() {
          this.post.id = Date.now();
          this.post.createdAt = new Date().toISOString();
          this.$emit("create", this.post);
          this.fetchPostsPost();
        },
        fetchPostsPost(){     
           axios
           .post('https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', this.post,
           {
            surname: this.surname,
            name: this.name,
            email: this.email,
            phone: this.phone,
            body: this.body,
            date: this.date,
            time: this.time            
            }
            )
          .then(response => {
              console.log(response);
              })
          .catch(error => {
           console.log(error); 
            });
          },
     },
    components: { MyInput }
}
</script>

<style scoped>
  h4{
    font-size: 24px;
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

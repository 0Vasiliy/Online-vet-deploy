  <template>
    <div class="post" :class="[btnClass,btnClass2]">
        <div v-if="!post.isEdit">
        <div class="post-wrapper post-number">№{{ postNumber }}</div>
          <div class="post-wrapper"><strong>Фамилия: </strong>{{ post.surname }}</div>
          <div class="post-wrapper"><strong>Имя: </strong>{{ post.name }}</div>
          <div class="post-wrapper"><strong>Электронная почта: </strong>{{ post.email }}</div>
          <div class="post-wrapper"><strong>Телефон: </strong>{{ post.phone }}</div>
          <div class="post-wrapper"><strong>Описание: </strong>{{ post.body }}</div>
          <div class="post-wrapper"><strong>Дата: </strong>{{ post.date }}</div>
          <div class="post-wrapper"><strong>Время: </strong>{{ post.time }}</div>
        </div>

        <div class="post-edit" v-else>
          <input v-model="post.surname" 
                 placeholder="Фамилия">
          <input v-model="post.name"
                 placeholder="Имя">
          <input v-model="post.email"
                 placeholder="Эл.Почта">
          <input v-maska="'+7(###)-###-##-##'"
                 v-model="post.phone"
                 placeholder="+7(000)-000-00-00">
          <textarea v-model="post.body" 
                 placeholder="Описание"></textarea>
          <input type="date"
                v-model="post.date"
                placeholder="Дата">
          <input v-maska="'##-##'"
                placeholder="ЧЧ-MM"
                v-model="post.time"> 
          <button @click="save(post)" class="btn_save">Сохранить</button>
        </div>
        <div class="post_btns">
          <my-button class="post_btn" @click="executed">Исполнено</my-button>
          <my-button class="post_btn" @click="cancellation">Отменить</my-button>
          <!-- <my-button class="post_btn" @click="$router.push('/posts/${post.id}')">Подробнее</my-button> -->
          <my-button 
          @click="edit(post)"
          v-bind:disabled="isDisabled"  
          class="post_btn"   
          >Редактировать</my-button>
          <my-button
          @click="$emit('remove',post.id)"
          v-bind:disabled="isDisabled"
          class="post_btn"
           >Удалить</my-button>
        </div>
    </div>
  </template>
<script setup>
 import { vMaska } from "maska/vue"
</script>
<script>
import MyButton from './UI/MyButton.vue'
import axios from 'axios' 

  export default {
   components:{
    MyButton,
   },
   data() {
    return {
      isDisabled: false,
      btnClass: "white-color",
      isNewPost: false,
      originalPost: null,
    };
   },
    props:{       
        post:{
          type: Object,
          require: true,
        },
        postNumber: {
          type: Number,
          required: true
        }
    },
    mounted() {
      // Check if post is new (created within last hour)
      const postTime = new Date(this.post.createdAt || Date.now());
      const now = new Date();
      const oneHourAgo = new Date(now - 60 * 60 * 1000);
      this.isNewPost = postTime > oneHourAgo;
    },
    methods: {
    edit(post) {
      // Сохраняем текущие значения перед редактированием
      this.originalPost = { ...post };
      post.isEdit = true;
    },
    save(post) {
      post.isEdit = false;
      this.updatePost();
    },
    cancellation() {
      if(this.btnClass === "white-color") {
        this.btnClass = "red-color";
        this.isDisabled = !this.isDisabled;
      } else {
        this.btnClass = "white-color";
      }
    },
    executed(){
    if(this.btnClass2 === "white-color") {
      this.btnClass2 = "green-color";
    } else {
     this.btnClass2 = "white-color";
    }
    this.isDisabled = !this.isDisabled;
    },
    async updatePost() {
      if (this.post) {
        try {
          await axios.put(`https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${this.post.id}.json`, {
            surname: this.post.surname,
            name: this.post.name,
            email: this.post.email,
            phone: this.post.phone,
            body: this.post.body,
            date: this.post.date,
            time: this.post.time
          });
        } catch (error) {
          console.error('Ошибка при обновлении поста:', error);
        }
      }
    },
  },
}
</script>
  
<style scoped>
.white-color {
  background: white;
 }
  
.red-color {
  background: #FA8072;
 }
 .green-color{
  background: #32CD32;
 }
.post{
  padding: 40px;
  border:  2px solid teal;
  border-radius: 10px;
  max-width: 50%; 
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.post-edit{
  display: flex;
  flex-flow: column;
 }
 input, textarea{
  width: 100%;
  margin-top: 10px;
  border-radius: 4px;
  padding: 7px;
  border:2px solid #BDB76B;
 }
  .post_btns{
    margin-bottom: 10px;
    position:absolute;
    right: 51%;
  }
  .post_btn{
    margin-top: 10px;
  }
  .btn_save{
    margin-top: 7px;
    padding: 7px;
    border:2px solid #BDB76B;
    cursor: pointer;
    border-radius: 4px;
  }
  .post-wrapper{
    max-width: 400px;
    word-wrap: break-word;
    height: auto;
  }
.post-number{
  color: teal;
}
  @media(max-width:1420px){
    .post-wrapper{
    max-width: 300px;
  }
  }
  @media(max-width:1250px){
    .post-wrapper{
    max-width: 200px;
  }
  }
  @media(max-width:1150px){
    .post{
      max-width: 100%;
      flex-direction: column;
    }
    .post_btn{
      right: 0;
      left:15%;
    }
    .post_btns{
      position: relative;
      right: 0;
    }
  }
  @media(max-width:650px){
    .post-wrapper{
    max-width: 185px;
  }
  }
  </style>
  
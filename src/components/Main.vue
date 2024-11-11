<template>
    <div class="main">
      <my-button class="btn-exit" @click.prevent="out($router.push('/'))">Выход из системы</my-button>
      <h1>Запись на приём Ветклиники "ЛИС"</h1>
      <div class="main_btns">
        <my-button
          @click="showDialog"
          class="main_btn"   
          >Создать клиента
        </my-button>
        <my-input 
        v-model="searchQuery"
        class="searh"
        placeholder="Поиск по фамилии..."
        ></my-input>
        <my-select 
        v-model="selectedSort"
        :options="sortOptions"
        />
      </div>
      <my-dialog v-model:show="dialogVisible">
          <PostForm 
            @create="createPost">
          </PostForm>
      </my-dialog>
      <post-list
          :posts="searchedPosts"
          @remove="removePost"
          >         
    </post-list>
  </div>
</template>

  <script>
  import axios from 'axios' 
  import PostForm from '../components/PostForm.vue';
  import PostList from '../components/PostList.vue';
  import PostItem from '../components/PostItem.vue';
  import MyButton from '../components/UI/MyButton.vue';
  import MyDialog from '../components/UI/MyDialog.vue';
  import MySelect from '../components/UI/MySelect.vue';
  import MyInput from '../components/UI/MyInput.vue';
  import { getAuth,signOut} from "firebase/auth";
  import app from '../../firebase'

  export default {
    name: 'Main',
    components: {
      PostForm,
      PostList,
      PostItem,
      MyButton,
      MyDialog,
      MySelect,
      MyInput,
  },
  props: {
    posts:{
      type: Array,
      require: true
    }
  },
    data(){
      return{
        intervalId: null,
        posts: [],
        dialogVisible: false,
        selectedSort: '',
        searchQuery: '',
        sortOptions:[
          {value: 'surname', name: 'По фамилии'},
          {value: 'name', name: 'По имени'},
          {value: 'email', name: 'По эл.почте'},
          {value: 'phone', name: 'По телефону'},
          {value: 'body', name: 'По услуге'},
          {value: 'date', name: 'По дате'},
          {value: 'time', name: 'По времени'},
        ]
      }   
    },
    methods: {
        // Создание поста
        createPost(post){
        this.posts.push(post);
        this.dialogVisible = false; 
        },
        // Удаление поста
        async removePost(postId) {
        try {
        // Удаление поста из Firebase по ID
         axios.delete(`https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`);
        this.posts = this.posts.filter(post => post.id !== postId);    
        } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        }
        },
        // //  Функция диалога, меняет значение dialogVisible     
        showDialog() {
          this.dialogVisible = true;
        },
        postData(posts){
        this.posts = [];
        for(let key in posts){
          this.posts.push({...posts[key],id: key});
        }
        console.log(this.posts)
        },
        out(){
        const auth = getAuth(app);
        signOut(auth).then(() => {
        this.user = ''
        }).catch((error) => {
    });
        },    
        fetchPostsGet() {
        axios.get('https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
          .then(response => {
              this.postData(response.data);
          })
          .catch(error => {
            console.error('Ошибка при получении данных:', error);
          });
      },
      startFetching() {
        // Получаем данные сразу при монтировании компонента
        this.fetchPostsGet();       
        // Устанавливаем интервал 
        this.intervalId = setInterval(this.fetchPostsGet, 2000);
      },
      stopFetching() {
        // Очищаем интервал, если он был установлен
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
      },    
   },
   computed:{
    sortedPosts() {
        return [...this.posts].sort((post1, post2) => post1[this.selectedSort]?.localeCompare(post2[this.selectedSort]))
    },   
      searchedPosts(){
        return this.sortedPosts.filter(post => post.surname.toLowerCase().includes(this.searchQuery.toLowerCase()))
        // || this.sortedPosts.filter(post => post.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        // || this.sortedPosts.filter(post => post.email.toLowerCase().includes(this.searchQuery.toLowerCase()))
        // || this.sortedPosts.filter(post => post.phone.toLowerCase().includes(this.searchQuery.toLowerCase()))
        // || this.sortedPosts.filter(post => post.body.toLowerCase().includes(this.searchQuery.toLowerCase()));
    // return this.sortedPosts.filter(post => Object.values(post).some(value => value.toString().toLowerCase().
      },
   },
   mounted() {
      this.startFetching();
    }, 
    beforeDestroy() {
      this.stopFetching(); // Останавливаем fetching 
    },
  }
  </script>
  
  <style scoped>
    .main{
      padding: 80px;
    }
   .main_btns{
    padding:20px;
    border:  2px solid teal;
    border-radius: 10px;
    max-width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .searh{
    width: 50%;
    height: 40px;
  }
  h1{
    margin-top: 40px;
    color: #2F4F4F;
    font-size: 28px;
    padding: 20px;
  }
  .btn-exit{
  background: #2F4F4F;
  color: gray;
  }
  .btn-exit:hover{
  background:  #8B0000;
  color: black;
  }
  @media(max-width:1500px){
    .searh{
     width: 40%;
    }
  }
  @media(max-width:1420px){
    h1{
      font-size: 24px;
    }
  }
  @media(max-width:1380px){
    .main_btn{
      width: 185px !important;
    }
    .main_btns{
      flex-direction: column;
      padding: 40px;
    }
    .searh{
     width: 185px;
     margin-top: 10px;
     margin-bottom: 10px;
    }
  }
  @media(max-width:1150px){
    .main{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    }
    h1{
      max-width: 45%;
      text-align: center;
      align-items: center;
    }
    .main_btns{
      max-width: 100%;
    }
  }
  @media(max-width:768px){
    h1{
      max-width: 55%;  
      font-size: 22px;  
    }
  }
  @media(max-width:635px){
    h1{
      max-width: 60%;    
    }
  }
  @media(max-width: 500px){
      .main>.dialog>.dialog_content{
      min-width: 300px;
    }
    h1{
    max-width: 80%;   
    }
  }
  @media(max-width: 400px){
      .main>.dialog>.dialog_content{
      min-width: 250px;
    }
  }

  </style>
  
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
        <my-button
          @click="showArchiveDialog"
          class="main_btn"   
          >Архив постов
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
      <my-dialog v-model:show="archiveDialogVisible">
          <ArchiveList 
            @post-restored="handlePostRestored"
            @close="archiveDialogVisible = false">
          </ArchiveList>
      </my-dialog>
      <post-list
          :posts="paginatedPosts"
          :totalPosts="posts.length"
          @remove="removePost"
          >         
    </post-list>
    <div class="pagination">
      <my-button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        Предыдущая
      </my-button>
      <span class="page-info">Страница {{ currentPage }} из {{ totalPages }}</span>
      <my-button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Следующая
      </my-button>
    </div>
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
  import ArchiveList from '../components/ArchiveList.vue';
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
      ArchiveList,
  },
  props: {
    posts:{
      type: Array,
      require: true
    }
  },
    data(){
      return{
        arhivedID: null,
        intervalId: null,
        posts: [],
        dialogVisible: false,
        archiveDialogVisible: false,
        selectedSort: '',
        searchQuery: '',
        sortOptions:[
          {value: 'surname', name: 'По фамилии'},
          {value: 'name', name: 'По имени'},
          {value: 'phone', name: 'По телефону'},
          {value: 'email', name: 'По эл.почте'},
          {value: 'body', name: 'По услуге'},
          {value: 'date', name: 'По дате'},
          {value: 'time', name: 'По времени'},
        ],
        currentPage: 1,
        postsPerPage: 5,
        // Добавляем конфигурацию для Telegram
        telegramConfig: {
          botToken: 'YOUR_BOT_TOKEN', // Замените на токен вашего бота
          chatIds: ['CHAT_ID_1', 'CHAT_ID_2'], // Замените на ID чатов для уведомлений
        }
      }   
    },
    methods: {
        // Создание поста
        async createPost(post){
          // Находим максимальный номер среди существующих постов
          const maxNumber = this.posts.length > 0 
            ? Math.max(...this.posts.map(p => p.postNumber || 0))
            : 0;
          // Присваиваем новый номер (на 1 больше максимального)
          post.postNumber = maxNumber + 1;
          this.posts.unshift(post);
          this.dialogVisible = false;

          // Отправляем уведомление в Telegram
          await this.sendTelegramNotification(post);
        },

        // Метод для отправки уведомления в Telegram
        async sendTelegramNotification(post) {
          try {
            const message = `🔔 Новая запись на приём!\n\n` +
                          `👤 Клиент: ${post.surname} ${post.name}\n` +
                          `📞 Телефон: ${post.phone}\n` +
                          `📧 Email: ${post.email}\n` +
                          `📅 Дата: ${post.date}\n` +
                          `⏰ Время: ${post.time}\n` +
                          `📝 Услуга: ${post.body}`;

            // Отправляем сообщение каждому чату из списка
            for (const chatId of this.telegramConfig.chatIds) {
              await axios.post(`https://api.telegram.org/bot${this.telegramConfig.botToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
              });
            }
          } catch (error) {
            console.error('Ошибка при отправке уведомления в Telegram:', error);
          }
        },
        // Удаление поста
        async removePost(postId) {
        try {
            // Находим пост по ID
            const postToRemove = this.posts.find(post => post.id === postId);

            if (postToRemove) {
                // Добавляем пост в архив
                await axios.post('https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/archivedPosts.json', {
                    ...postToRemove,
                    archivedAt: new Date().toISOString() // Добавляем метку времени
                });

                // Удаляем пост из основной коллекции
                await axios.delete(`https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`);

                // Локально убираем пост
                this.posts = this.posts.filter(post => post.id !== postId);
            } else {
                console.warn('Post not found:', postId);
            }
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
        }
        },
         // Проверка архивных постов, если старше 30 дней то удаляем   
        async checkArchivedPosts() {
        try {
            const response = await axios.get('https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/archivedPosts.json');
            const archivedPosts = response.data || {};

            const currentTime = new Date();
            const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах

            for (const key in archivedPosts) {
                const archivedPost = archivedPosts[key];
                const archivedAt = new Date(archivedPost.archivedAt);

                // Если пост был архивирован более 30 дней назад, удаляем его
                if (currentTime - archivedAt > thirtyDaysInMillis) {
                    await axios.delete(`https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/archivedPosts/${key}.json`);
                }
            }
        } catch (error) {
            console.error('Ошибка при проверке архивных постов:', error);
        }
        },
        //  Функция диалога, меняет значение dialogVisible     
        showDialog() {
          this.dialogVisible = true;
        },
        showArchiveDialog() {
          this.archiveDialogVisible = true;
        },
        handlePostRestored() {
          this.fetchPostsGet();
        },
        postData(posts){
        this.posts = [];
        let postNumber = 1;
        for(let key in posts){
          const post = {...posts[key], id: key};
          // Если у поста уже есть номер, используем его, иначе присваиваем новый
          post.postNumber = post.postNumber || postNumber++;
          this.posts.push(post);
        }
        // Сортируем посты по номеру в обратном порядке (новые сверху)
        this.posts.sort((a, b) => b.postNumber - a.postNumber);
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
        this.intervalId = setInterval(this.fetchPostsGet, 900000);
      },
      stopFetching() {
        // Очищаем интервал, если он был установлен
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
      }, 
      arhivedInterval(){
        this.arhivedID = setInterval(this.checkArchivedPosts, 24 * 60 * 60 * 1000); // 24 часа
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
   },
   computed:{
    sortedPosts() {
        if (!this.selectedSort) return this.posts;
        
        return [...this.posts].sort((post1, post2) => {
          const value1 = post1[this.selectedSort] || '';
          const value2 = post2[this.selectedSort] || '';
          
          // Специальная обработка для даты
          if (this.selectedSort === 'date') {
            return new Date(value1) - new Date(value2);
          }
          
          // Специальная обработка для времени
          if (this.selectedSort === 'time') {
            const [hours1, minutes1] = value1.split('-').map(Number);
            const [hours2, minutes2] = value2.split('-').map(Number);
            return (hours1 * 60 + minutes1) - (hours2 * 60 + minutes2);
          }
          
          return value1.toString().localeCompare(value2.toString());
        });
    },   
      searchedPosts(){
        return this.sortedPosts.filter(post => post.surname.toLowerCase().includes(this.searchQuery.toLowerCase()))
      },
    paginatedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.searchedPosts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.searchedPosts.length / this.postsPerPage);
    }
   },
   mounted() {
      this.startFetching();
      this.arhivedInterval();
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
    gap:10px;
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
    .pagination {
      max-width: 100%;
      flex-direction: column;
      gap: 10px;
      padding: 0 20px;
    }
    .pagination-btn {
      max-width: 100%;
      margin: 0;
      padding: 10px 20px;
    }
    .page-info {
      padding: 10px 0;
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
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
    padding: 0 20px;
  }

  .pagination-btn {
    flex: 1;
    max-width: 150px;
    margin: 0 10px;
  }

  .page-info {
    color: #2F4F4F;
    font-size: 16px;
    flex: 0 0 auto;
    padding: 0 10px;
  }
  </style>
  
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
            @create="handleCreatePost"
            @close="dialogVisible = false">
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
  // Импорт необходимых компонентов и утилит
  import axios from 'axios' 
  import PostForm from '../components/PostForm.vue';
  import PostList from '../components/PostList.vue';
  import PostItem from '../components/PostItem.vue';
  import MyButton from '../components/UI/MyButton.vue';
  import MyDialog from '../components/UI/MyDialog.vue';
  import MySelect from '../components/UI/MySelect.vue';
  import MyInput from '../components/UI/MyInput.vue';
  import ArchiveList from '../components/ArchiveList.vue';
  import { getAuth, signOut } from "firebase/auth";
  import { auth } from '../firebase/config';
  import { usePostsStore } from '../stores/posts';
  import { mapState, mapActions } from 'pinia';
  
  export default {
    name: 'Main',
    // Регистрация компонентов
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
    // Локальное состояние компонента
    data() {
      return {
        dialogVisible: false, // Видимость диалога создания поста
        archiveDialogVisible: false, // Видимость диалога архива
        telegramConfig: { // Конфигурация для Telegram уведомлений
          botToken: 'YOUR_BOT_TOKEN',
          chatIds: ['CHAT_ID_1', 'CHAT_ID_2'],
        }
      };
    },
    // Вычисляемые свойства из store
    computed: {
      ...mapState(usePostsStore, [
        'posts',
        'selectedSort',
        'searchQuery',
        'sortOptions',
        'currentPage',
        'postsPerPage',
        'paginatedPosts',
        'totalPages'
      ])
    },
    // Методы компонента
    methods: {
      // Действия из store
      ...mapActions(usePostsStore, [
        'createPost',
        'removePost',
        'nextPage',
        'prevPage',
        'startFetching',
        'stopFetching',
        'startArchivedInterval'
      ]),
      // Обработка создания поста
      async handleCreatePost(post) {
        await this.createPost(post);
        await this.sendTelegramNotification(post);
      },
      // Показать диалог создания поста
      showDialog() {
        this.dialogVisible = true;
      },
      // Показать диалог архива
      showArchiveDialog() {
        this.archiveDialogVisible = true;
      },
      // Обработка восстановления поста из архива
      handlePostRestored() {
        this.startFetching();
      },
      // Выход из системы
      out() {
        signOut(auth).then(() => {
          this.user = '';
        }).catch((error) => {
          console.error('Ошибка при выходе:', error);
        });
      },
      // Отправка уведомления в Telegram
      async sendTelegramNotification(post) {
        try {
          const message = `🔔 Новая запись на приём!\n\n` +
                        `👤 Клиент: ${post.surname} ${post.name}\n` +
                        `📞 Телефон: ${post.phone}\n` +
                        `📧 Email: ${post.email}\n` +
                        `📅 Дата: ${post.date}\n` +
                        `⏰ Время: ${post.time}\n` +
                        `📝 Услуга: ${post.body}`;

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
      }
    },
    // Хуки жизненного цикла
    mounted() {
      this.startFetching();
      this.startArchivedInterval();
    },
    beforeDestroy() {
      this.stopFetching();
    }
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
      max-width: 185px;
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
  </style>
  
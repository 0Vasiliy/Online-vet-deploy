<template>
  <div class="archive-list">
    <div class="archive-header">
      <h3>Архив постов</h3>
      <my-button class="close-btn" @click="$emit('close')">×</my-button>
    </div>
    <div class="archive-posts">
      <div v-for="post in paginatedArchivedPosts" :key="post.id" class="archive-post">
        <div class="post-wrapper"><strong>№{{ post.postNumber }}</strong></div>
        <div class="post-wrapper"><strong>Фамилия: </strong>{{ post.surname }}</div>
        <div class="post-wrapper"><strong>Имя: </strong>{{ post.name }}</div>
        <div class="post-wrapper"><strong>Электронная почта: </strong>{{ post.email }}</div>
        <div class="post-wrapper"><strong>Телефон: </strong>{{ post.phone }}</div>
        <div class="post-wrapper"><strong>Описание: </strong>{{ post.body }}</div>
        <div class="post-wrapper"><strong>Дата: </strong>{{ post.date }}</div>
        <div class="post-wrapper"><strong>Время: </strong>{{ post.time }}</div>
        <div class="post-wrapper"><strong>Дата архивации: </strong>{{ formatDate(post.archivedAt) }}</div>
        <my-button class="restore-btn" @click="restorePost(post)">Восстановить</my-button>
      </div>
    </div>
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
import MyButton from './UI/MyButton.vue';
import axios from 'axios';

export default {
  components: {
    MyButton
  },
  data() {
    return {
      archivedPosts: [],
      currentPage: 1,
      postsPerPage: 5,
    }
  },
  methods: {
    async fetchArchivedPosts() {
      try {
        const response = await axios.get('https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/archivedPosts.json');
        const posts = response.data || {};
        this.archivedPosts = Object.entries(posts).map(([key, value]) => ({
          ...value,
          id: key
        }));
      } catch (error) {
        console.error('Ошибка при получении архивных постов:', error);
      }
    },
    async restorePost(post) {
      try {
        // Создаем новый пост в основной коллекции
        await axios.post('https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', {
          ...post,
          id: Date.now()
        });

        // Удаляем пост из архива
        await axios.delete(`https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app/archivedPosts/${post.id}.json`);

        // Обновляем список архивных постов
        this.fetchArchivedPosts();
        
        // Эмитим событие для обновления основного списка
        this.$emit('post-restored');
      } catch (error) {
        console.error('Ошибка при восстановлении поста:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU');
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
    }
  },
  computed: {
    paginatedArchivedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.archivedPosts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.archivedPosts.length / this.postsPerPage);
    }
  },
  mounted() {
    this.fetchArchivedPosts();
  }
}
</script>

<style scoped>
.archive-list {
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.archive-header {
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

.archive-posts {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.archive-post {
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.post-wrapper {
  margin-bottom: 10px;
}

.restore-btn {
  margin-top: 15px;
  background-color: #4CAF50;
  color: white;
}

.restore-btn:hover {
  background-color: #45a049;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.pagination-btn {
  min-width: 120px;
}

.page-info {
  color: #2F4F4F;
  font-size: 16px;
}
</style> 
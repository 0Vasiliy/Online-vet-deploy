import { defineStore } from 'pinia';
import { postsApi } from '../api/posts';

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    archivedPosts: [],
    currentPage: 1,
    postsPerPage: 5,
    selectedSort: '',
    searchQuery: '',
    sortOptions: [
      { value: 'postNumber', name: 'По номеру' },
      { value: 'surname', name: 'По фамилии' },
      { value: 'name', name: 'По имени' },
      { value: 'email', name: 'По эл.почте' },
      { value: 'phone', name: 'По телефону' },
      { value: 'body', name: 'По услуге' },
      { value: 'date', name: 'По дате' },
      { value: 'time', name: 'По времени' }
    ],
    intervalId: null,
    arhivedID: null
  }),

  getters: {
    sortedPosts() {
      if (!this.selectedSort) return this.posts;
      
      return [...this.posts].sort((post1, post2) => {
        const value1 = post1[this.selectedSort] || '';
        const value2 = post2[this.selectedSort] || '';
        
        switch (this.selectedSort) {
          case 'postNumber':
            return Number(value1) - Number(value2);
            
          case 'date':
            return new Date(value1) - new Date(value2);
            
          case 'time':
            const [hours1, minutes1] = value1.split('-').map(Number);
            const [hours2, minutes2] = value2.split('-').map(Number);
            return (hours1 * 60 + minutes1) - (hours2 * 60 + minutes2);
            
          default:
            return value1.toString().localeCompare(value2.toString(), 'ru', { sensitivity: 'base' });
        }
      });
    },

    searchedPosts() {
      if (!this.searchQuery || this.searchQuery.trim() === '') {
        return this.sortedPosts;
      }

      const searchTerm = this.searchQuery.trim().toLowerCase();

      return this.sortedPosts.filter(post => {
        if (!post || !post.surname) {
          return false;
        }

        const surname = post.surname.toString().toLowerCase();
        
        return surname.includes(searchTerm);
      });
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

  actions: {
    async fetchPosts() {
      try {
        const posts = await postsApi.getPosts();
        this.posts = [];
        let postNumber = 1;
        
        for (let key in posts) {
          const post = { ...posts[key], id: key };
          post.postNumber = post.postNumber || postNumber++;
          this.posts.push(post);
        }
        
        this.posts.sort((a, b) => b.postNumber - a.postNumber);
      } catch (error) {
        console.error('Ошибка при получении постов:', error);
      }
    },

    async createPost(post) {
      try {
        const maxNumber = this.posts.length > 0 
          ? Math.max(...this.posts.map(p => p.postNumber || 0))
          : 0;
        
        post.postNumber = maxNumber + 1;
        const postId = await postsApi.createPost(post);
        post.id = postId;
        this.posts.unshift(post);
      } catch (error) {
        console.error('Ошибка при создании поста:', error);
      }
    },

    async removePost(postId) {
      try {
        const postToRemove = this.posts.find(post => post.id === postId);
        if (postToRemove) {
          await postsApi.archivePost(postToRemove);
          await postsApi.deletePost(postId);
          this.posts = this.posts.filter(post => post.id !== postId);
        }
      } catch (error) {
        console.error('Ошибка при удалении поста:', error);
      }
    },

    async checkArchivedPosts() {
      try {
        const archivedPosts = await postsApi.getArchivedPosts();
        const currentTime = new Date();
        const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;

        for (const key in archivedPosts) {
          const archivedPost = archivedPosts[key];
          const archivedAt = new Date(archivedPost.archivedAt);

          if (currentTime - archivedAt > thirtyDaysInMillis) {
            await postsApi.deleteArchivedPost(key);
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке архивных постов:', error);
      }
    },

    startFetching() {
      this.fetchPosts();
      this.intervalId = setInterval(this.fetchPosts, 900000);
    },

    stopFetching() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    },

    startArchivedInterval() {
      this.arhivedID = setInterval(this.checkArchivedPosts, 24 * 60 * 60 * 1000);
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

    setSort(value) {
      this.selectedSort = value;
      this.currentPage = 1;
    },

    setSearch(value) {
      this.searchQuery = value;
      this.currentPage = 1;
    }
  }
}); 
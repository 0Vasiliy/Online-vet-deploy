import { ref, get, set, remove, push } from 'firebase/database';
import { db } from '../firebase/config';

// Объект с методами для работы с постами
export const postsApi = {
  // Получение всех постов из базы данных
  async getPosts() {
    const postsRef = ref(db, 'posts');
    const snapshot = await get(postsRef);
    return snapshot.val() || {};
  },

  // Создание нового поста
  async createPost(post) {
    const postsRef = ref(db, 'posts');
    const newPostRef = push(postsRef);
    await set(newPostRef, post);
    return newPostRef.key;
  },

  // Удаление поста по ID
  async deletePost(postId) {
    const postRef = ref(db, `posts/${postId}`);
    await remove(postRef);
  },

  // Архивирование поста (перемещение в архив)
  async archivePost(post) {
    const archivedPostsRef = ref(db, 'archivedPosts');
    const newArchivedPostRef = push(archivedPostsRef);
    await set(newArchivedPostRef, {
      ...post,
      archivedAt: new Date().toISOString()
    });
  },

  // Получение всех архивных постов
  async getArchivedPosts() {
    const archivedPostsRef = ref(db, 'archivedPosts');
    const snapshot = await get(archivedPostsRef);
    return snapshot.val() || {};
  },

  // Удаление архивного поста по ID
  async deleteArchivedPost(postId) {
    const archivedPostRef = ref(db, `archivedPosts/${postId}`);
    await remove(archivedPostRef);
  }
}; 
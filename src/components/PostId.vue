<!-- <template>
    <div class="post-id">
        <h1>Страница поста ID = {{ $route.params.id }}</h1>
    </div>
</template>

<script>
export default {
    name: 'postId'
}
</script>

<style scoped>
    
</style> -->
<template>
    <div>
      <h1>Данные из Firebase</h1>
      <ul>
        <li v-for="item in items" :key="item.id">{{ item.name }}</li> <!-- Предположим, что у ваших данных есть поле name -->
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        items: [],
        intervalId: null,
      };
    },
    methods: {
      fetchData() {
        // Замените URL на ваш URL для доступа к Firebase
        axios.get('https://your-firebase-url.com/data')
          .then(response => {
            this.items = response.data; // Обновляем данные
          })
          .catch(error => {
            console.error('Ошибка при получении данных:', error);
          });
      },
      startFetching() {
        // Получаем данные сразу при монтировании компонента
        this.fetchData();
        
        // Устанавливаем интервал на 60 секунд (60000 мс)
        this.intervalId = setInterval(this.fetchData, 60000);
      },
      stopFetching() {
        // Очищаем интервал, если он был установлен
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
      },
    },
    mounted() {
      this.startFetching(); // Начинаем fetching данных когда компонент монтируется
    },
    beforeDestroy() {
      this.stopFetching(); // Останавливаем fetching когда компонент удаляется
    },
  };
  </script>
  
  <style>
  /* Добавьте ваши стили при необходимости */
  </style>
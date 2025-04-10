import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Конфигурация Firebase проекта с тестовой базой
const firebaseConfig = {
  apiKey: "AIzaSyBjP3AEJNKVFp07ROomynZ_QzNYyzsug_4",
  authDomain: "vet-onlain.firebaseapp.com",
  databaseURL: "https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vet-onlain",
  storageBucket: "vet-onlain.appspot.com",
  messagingSenderId: "140746709659",
  appId: "1:140746709659:web:2d91a30a8a23c86eb4043e"
};

// Инициализация Firebase приложения
const app = initializeApp(firebaseConfig);

// Получение экземпляров базы данных и аутентификации
export const db = getDatabase(app);
export const auth = getAuth(app);

// Экспорт приложения по умолчанию
export default app; 
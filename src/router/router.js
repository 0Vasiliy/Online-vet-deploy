import { createWebHistory, createRouter } from 'vue-router'
import Main from '../components/Main.vue'
import login from '../components/authentication/Login.vue'
import Register from '../components/authentication/Register.vue'
import About from '../components/authentication/About.vue'
// import PostId from '../components/PostId.vue'
import { getAuth, onAuthStateChanged} from "firebase/auth";
import app from '../../firebase'
import "firebase/auth"
import "firebase/app"

const routes = [
    { path: '/',
    component: About
    },
    { path: '/Main',
     component: Main,
     name: Main,
        meta:{
          requiresAuth: true
        }
    },  
    // { path: '/posts/:id',
    //  component: PostId
    // },
    { path: '/login',
      component: login,
      name: login,
      
    },
   
   { path: '/Register',
    component: Register
    },

  ]

  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
   const auth = getAuth(app)
// Auth-Login
  async function getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe()
          resolve(user)
        },
        reject
      )
    })
  }
  router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    if (requiresAuth && !(await getCurrentUser())) {
      // return '/Main'
        router.push({ name: 'Main' });
    }
    else{
      return true;
    }
  })

export default router;

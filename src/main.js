import { createApp } from 'vue'
import App from './App.vue'
import components from './components/UI';
import router from './router/router';
import directives from './directives';
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

components.forEach(component => {
  app.component(component.name, component)
})

directives.forEach(directive => {
  app.directive(directive.name, directive)
})

app.use(router)
app.use(pinia)
app.mount('#app')
export default app;


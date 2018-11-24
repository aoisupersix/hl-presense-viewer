import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'jquery'
import SuiVue from 'semantic-ui-vue'
import VueGoogleCharts from 'vue-google-charts'
import 'semantic-ui-css/semantic.min.css'
import Firebase from 'firebase/app'
import 'firebase/database'
import { firebaseConfig } from '@/firebaseConfig'

Vue.config.productionTip = false
Vue.use(SuiVue)
Vue.use(VueGoogleCharts)

// Firebaseの初期化
Firebase.initializeApp(firebaseConfig)
export const firebaseDatabase = Firebase.database()

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')

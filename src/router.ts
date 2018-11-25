import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import StatusMobileView from './views/StatusMobileView.vue'

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/statusMobile/:id',
      name: 'status-mobile-view',
      component: StatusMobileView,
    },
  ],
});

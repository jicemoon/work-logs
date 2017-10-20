import Vue from 'vue';
import VueRouter from 'vue-router';
import './../../server/src/common/prototype.extends';
import './scss/main.scss';

import { IndexComponent } from './components/index/index';

import { router } from './routes/index';

Vue.use(VueRouter);


export default new Vue({
  el: '#app-main',
  router: router,
  components: {
    'index': IndexComponent
  }
});

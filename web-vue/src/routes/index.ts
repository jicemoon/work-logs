
import VueRouter from 'vue-router';
import { AllLogsComponent } from './../components/pages/all-logs/all-logs.page';

const router = new VueRouter({
  routes: [
    { path: '/', component: AllLogsComponent }
  ]
});
export { router };

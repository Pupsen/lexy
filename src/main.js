import Vue from 'vue';
import App from './App.vue';
import router from './router';
import jQuery from 'jquery';
import BootstrapVue from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/assets/styles/main.css';

window.jQuery = jQuery;

Vue.use(BootstrapVue);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Datepicker from 'vuejs-datepicker';

Vue.config.productionTip = false

new Vue({
  vuetify,
  Datepicker,
  render: h => h(App)
}).$mount('#app')

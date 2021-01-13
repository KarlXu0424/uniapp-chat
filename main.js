import Vue from 'vue'
import App from './App'
import indexedDB from './static/js/indexedDB.js'

Vue.prototype.$indexedDB = indexedDB
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

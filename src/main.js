import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "normalize.css/normalize.css";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import locale from 'element-plus/es/locale/lang/ja' 
import locale from 'element-plus/dist/locale/ja.min.js' // Try dist min file

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import "@/styles/index.scss";

import installIcons from "@/icons";
import "@/permission";

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

installIcons(app)
app.use(store)
app.use(router)
app.use(ElementPlus, { locale })
app.use(vuetify)

app.mount('#app')

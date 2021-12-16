//import '@babel/polyfill'
//import 'mutationobserver-shim'
// Base Vue Imports
import Vue from 'vue'

// to use vue 3 composition API in vue 2:
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

//import './plugins/bootstrap-vue'
//import Popper from 'vue-popperjs'

// app imports
import App from '@/App' 
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//import Buefy from 'buefy'
//import 'buefy/dist/buefy.css'



//import 'vue-popperjs/dist/vue-popper.css'
//import router from '@/router' //import router.js into main.js
//import store from '@/store/storeCY'   // for VUEX data
import store from '@/store/storeUsingObjectNotArray'
//import dagre from 'cytoscape-dagre'         // for auto-layout of matrix diagram
// for jointjs (modified, from https://github.com/JoseGoncalves/vue-jointjs/blob/master/src/main.js)
//import Joint from '@/plugins/joint'         // for matrix diagram (superseded)
import VueCytoscape from 'vue-cytoscape'    // for matrix diagram
//import VuePapaParse from 'vue-papa-parse'   // for CSV I/O

import 'cytoscape-grid-guide'

//import VueKonva from 'vue-konva'            // not used, from alt diagram library test
//import VueSplitter from 'vue-splitter-pane' // for main layout https://github.com/venkatperi/vue-splitter-pane
//import {Splitpanes, Pane} from 'splitpanes'          // https://github.com/antoniandre/splitpanes
//import 'splitpanes/dist/splitpanes.css'

// apply imported libraries
Vue.use(BootstrapVue)       // for main UI components
Vue.use(BootstrapVueIcons)  // for main UI icons
//Vue.use(Buefy)
//Vue.use(Popper)
//Vue.use(VuePapaParse)       // for CSV I/O
Vue.use(VueCytoscape)       // for matrix diagram

//Vue.use(VueSplitter)        // registers vue-splitter, vue-splitter-v and vue-splitter-h 

//Vue.use(dagre)            // for auto-layout of matrix diagram
Vue.config.productionTip = false

/*
// todo - incorporate VueRouter, to have contexts, groups, matrix etc. separate pages?
import VueRouter from 'vue-router'
Vue.use(VueRouter);
import Home from '@/Components/Home'
import Page1 from '@/Components/Page1'
import Page2 from '@/Components/Page2'
const routes = [
    { path: '/', component: Home },
    { path: '/page1/:id?', component: Page1 },
    { path: '/page2', component: Page2 }
];
const router = new VueRouter({
    mode: 'history',
    routes
});
*/
//import { useStore } from 'vuex'
//import { createApp } from 'vue'
//createApp({provide: {store}, store, ...App}).mount('#app')
//createApp({provide: {store}}).mount('#app')
//app.use(store)

new Vue({
    //router: router,
    provide: { store },
    //store: store, // vuex store - see ./store/storeCY.js
    render: h => h(App) 
}).$mount('#app')
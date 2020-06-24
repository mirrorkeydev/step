import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'
import { Home } from './pages/home.js'
import { NavHeader } from './components/navheader.js'
import { Footer } from './components/footer.js'


Vue.use(VueRouter);

const routes = [{
        path: '/',
        component: Home
    },
]

const router = new VueRouter({
    routes
})

const mainTemplate = `
<div>
  <NavHeader></NavHeader>
  <router-view></router-view>
  <Footer></Footer>
</div>`;

var app = new Vue({
    el: '#app',
    router,
    components: {
        'NavHeader': NavHeader,
        'Footer': Footer,
    },
    template: mainTemplate,
    data: () => {
        return {
            msg: 'Hello'
        }
    },
})
import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'
import { Home } from './pages/home.js'
import { MainTemplate } from './templates/mainttemplate.js'
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

var app = new Vue({
    el: '#app',
    router,
    components: {
        'NavHeader': NavHeader,
        'Footer': Footer,
    },
    template: MainTemplate,
    data: () => {
        return {
            msg: 'Hello'
        }
    },
})
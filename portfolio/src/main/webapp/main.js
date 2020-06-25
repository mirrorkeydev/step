import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'
import { Home } from './pages/home.js'
import { NavHeader } from './components/navheader.js'
import { Footer } from './components/footer.js'

Vue.use(VueRouter);

// Which components to render at which endpoint
const routes = [{
        path: '/',
        component: Home
    },
]

// Inject our defined routes into VueRouter.
const router = new VueRouter({
    routes
})

// The main template that defines the entire page.
// This is injected directly into the #app div.
const mainTemplate = `
<div>
  <NavHeader></NavHeader>
  <router-view></router-view>
  <Footer></Footer>
</div>`;

// The parent Vue instance that wraps all children.
// Renders the mainTemplate to the user in the #app div.
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

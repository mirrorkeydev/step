import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'
import { Home } from './pages/home.js'
import { About } from './pages/about.js'
import { NavHeader } from './components/navheader.js'
import { Footer } from './components/footer.js'
import { Contact } from './pages/contact.js'
import { Projects } from './pages/projects.js';

Vue.use(VueRouter);

// Which components to render at which endpoint
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/projects',
    component: Projects,
  },
  {
    path: '/contact',
    component: Contact,
  },
];

// Inject our defined routes into VueRouter.
const router = new VueRouter({
    routes
});

// The main template that defines the entire page.
const mainTemplate = `
<div>
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
})

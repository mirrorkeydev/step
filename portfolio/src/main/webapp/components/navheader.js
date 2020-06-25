const NavHeaderTemplate = 
`<div id="header-container">
    <img id="header-img" src="./assets/me.jpg" alt="Profile picture">
    <router-link id="header" to="/">Melanie Gutzmann</router-link>
    <div id="nav-links">
        <router-link class="nav-link" to="/about">About</router-link>
        <router-link class="nav-link" to="/projects">Projects</router-link>
        <router-link class="nav-link" to="/contact">Contact</router-link>
    </div>
</div>`;

const NavHeader = {
    template: NavHeaderTemplate,
};

export { NavHeader };

const NavHeaderTemplate = 
`<div id="header-container">
    <img id="header-img" src="./assets/me.jpg" alt="Profile picture">
    <span id="header">Melanie Gutzmann</span>
    <div id="nav-links">
        <router-link class="nav-link" to="/about">About</router-link>
        <router-link class="nav-link" href="/projects">Projects</router-link>
        <router-link class="nav-link" href="/contact">Contact</router-link>
    </div>
</div>`;

const NavHeader = {
    template: NavHeaderTemplate,
};

export { NavHeader };

var Home = Vue.component("Home", {
    template: `<div>
    <div id="header-container">
        <img id="header-img" src="./images/me.jpg" alt="Profile picture">
        <span id="header">Melanie Gutzmann</span>
          <div id="nav-links">
            <a class="nav-link" href="#">About</a>
            <a class="nav-link" href="#">Projects</a>
            <a class="nav-link" href="#">Contact</a>
        </div>
      </div>
  
      <!--All preview boxes-->
      <div id="body-container">
        <!--"About" preview box-->
        <div class="preview-title">About</div>
        <div class="preview-container about">
          <div class="preview-paragraph">
            Hello! My name is Melanie, and I'm a sophomore at Oregon State University.
          </div>
          <br/>
          <div class="preview-read-more">
            <a href="/about.html">read more →</a>
          </div>
        </div>
        <!--"Projects" preview box-->
        <div class="preview-title">Projects</div>
        <div class="preview-container projects">
          <div class="preview-img-w-text">
            <div class="preview-img-text">
              <div class="preview-subtitle">
              Appstract (2018)
              </div>
              <div class="preview-img-description">
                An artistically abstract Android icon pack.
                300+ icons supported across 25+ launchers.
                Built on the open source CandyBar dashboard.
                Available on the Google Play Store
                <a href="https://play.google.com/store/apps/details?id=com.melon.appstract&hl=en_US">here.</a>
              </div>
            </div>
            <img class="preview-img" src="./images/appstract.png" alt="Apptract icon">
          </div>
          <br/>
          <div class="preview-read-more">
            <a href="/projects.html">see more →</a>
          </div>
        </div>
        <!--"Contact" preview box-->
        <div class="preview-title">Contact</div>
        <div class="preview-container contact">
          <div class="preview-icons-grid">
            <a class="icon-link" href="#"><i class="fas fa-envelope fa-3x"></i></a>
            <a class="icon-link" href="#"><i class="fab fa-linkedin-in fa-3x"></i></a>
            <a class="icon-link" href="#"><i class="fab fa-github fa-3x"></i></a>
          </div>
          <br/>
          <div class="preview-read-more">
            <a href="/contact.html">more ways to reach me →</a>
          </div>
        </div>
      </div>
  
      <!--Footer-->
      <div id="footer-container">
        <div class="footer-text">
          Last updated 2020.
          <a href="https://fonts.google.com/">Fonts.</a>
        </div>
      </div>
</div>`,
    props: ["title"],
    data: () => {
      return {}
    },
    methods: {
    }
  });
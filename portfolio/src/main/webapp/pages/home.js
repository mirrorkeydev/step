const HomeTemplate = 
`<div>  
  <div id="body-container">

    <SimpleBox title="About" url="/about" moreText="read more" >
      Hello! My name is Melanie, and I'm a sophomore at Oregon State University.
    </SimpleBox>

    <SimpleBox title="Projects" url="/projects" moreText="see more" >
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
          <img class="preview-img" src="./assets/appstract.png" alt="Apptract icon">
        </div>
    </SimpleBox>

    <SimpleBox title="Contact" url="/contact" moreText="more ways to reach me" >
      <div class="preview-icons-grid">
        <a class="icon-link" href="#"><i class="fas fa-envelope fa-3x"></i></a>
        <a class="icon-link" href="#"><i class="fab fa-linkedin-in fa-3x"></i></a>
        <a class="icon-link" href="#"><i class="fab fa-github fa-3x"></i></a>
      </div>
    </SimpleBox>

  </div>
`;

import { SimpleBox } from '../components/simplebox.js'

const Home = {
    template: HomeTemplate,
    components: {
      'SimpleBox': SimpleBox
    }
}

export {Home}
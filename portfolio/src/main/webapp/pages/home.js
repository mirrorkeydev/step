/*
 * The home/landing page of the website.
 * Contains preview boxes for other pages on the site.
 */

const HomeTemplate = 
`<div id="body-container">

  <PreviewBox title="About" url="/about" moreText="read more" >
    Hello! My name is Melanie, and I'm a sophomore at Oregon State University.
  </PreviewBox>

  <PreviewBox title="Projects" url="/projects" moreText="see more" >
    <CaptionedImage caption="Appstract (2018)" imgUrl="./assets/appstract.png">
      An artistically abstract Android icon pack. 300+ icons supported across 25+ launchers.
      Built on the open source CandyBar dashboard. Available on the Google Play Store
      <a href="https://play.google.com/store/apps/details?id=com.melon.appstract&hl=en_US">here.</a>
    </CaptionedImage>
  </PreviewBox>

  <PreviewBox title="Contact" url="/contact" moreText="more ways to reach me" >
    <div class="preview-icons-grid">
      <a class="icon-link" href="#"><i class="fas fa-envelope fa-3x"></i></a>
      <a class="icon-link" href="#"><i class="fab fa-linkedin-in fa-3x"></i></a>
      <a class="icon-link" href="#"><i class="fab fa-github fa-3x"></i></a>
    </div>
  </PreviewBox>

</div>`;

import { PreviewBox } from '../components/previewbox.js';
import { CaptionedImage } from '../components/captionedimage.js';

const Home = {
    template: HomeTemplate,
    components: {
      'PreviewBox': PreviewBox,
      'CaptionedImage': CaptionedImage,
    },
};

export { Home };

/*
 * The about page of the website.
 */

const AboutTemplate = 
`<div id="body-container">

  <TextBox>
    I am an about page!
  </TextBox>

</div>`;

import { TextBox } from '../components/textbox.js';

const About = {
    template: AboutTemplate,
    components: {
        'TextBox': TextBox,
    },
};

export { About };

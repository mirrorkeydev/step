/*
 * The about page of the website.
 */

const AboutTemplate = 
`<div id="body-container">

  <TextBox>

    <h2 class="centered">About</h2>
    <br/>

    <p>
        Hello! My name is Melanie, and I'm a sophomore at Oregon State University.
    </p>

    <IconTitle icon="far fa-bookmark fa-2x">Studying</IconTitle>
    <ul>
      <li><i>Major:</i> Applied Computer Science</li>
      <li><i>Minor:</i> Mathematics</li>
      <li><i>Option:</i> Data Science</li>
    </ul>

    <IconTitle icon="far fa-building fa-2x">Working</IconTitle>
    <ul>
      <li><i>2020 Summer:</i> STEP Intern @ Google</li>
      <li><i>2019 - Present:</i> Student Software Developer @ Center for Applied Systems and Software</li>
    </ul>

    <IconTitle icon="far fa-file-code fa-2x">Writing</IconTitle>
    <ul>
      <li>C# (.NET), Python, TypeScript, Vue.JS, SQL, HTML/CSS/JS</li>
    </ul>

    <IconTitle icon="far fa-dot-circle fa-2x">Listening To</IconTitle>
    <ul>
      <li>
        Glass Animals, Watsky, Saint Motel, K. Flay, Caravan Palace, alt-J,
        Alligatoah, Milky Chance, Von Wegen Lisbeth, UPSAHL, Red Royal, Nodaway
      </li>
    </ul>
    
    <IconTitle icon="far fa-save fa-2x">Collecting</IconTitle>
    <ul>
      <li>Plants (to tend to)</li>
      <li>Glass containers (to use as tupperware)</li>
      <li>Cardboard boxes (for virtually no reason)</li>
    </ul>
  </TextBox>

</div>`;

import { TextBox } from '../components/textbox.js';
import { IconTitle } from '../components/icontitle.js';

const About = {
    template: AboutTemplate,
    components: {
        'TextBox': TextBox,
        'IconTitle': IconTitle,
    },
};

export { About };

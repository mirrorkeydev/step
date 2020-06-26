/*
 * The projects page of the website, containing
 * a grid of projects I've worked on.
 */

const ProjectsTemplate = 
`<div id="body-container">

  <h2 class="centered">Projects</h2>

  <div class="imagebox-collection">
    <ImageBox title="Sprout (2020)" link="#"
    subtitle="Personal project" img="./assets/sprout2.png">
      A dashboard that shows real-time statistics about my plants and their environment.
      Offers soil moisture charts for each plant connected to Sprout and
      environmental statistics about the plants' environment, including temperature/humidity.
      Plus, it's pretty cute.
    </ImageBox>

    <ImageBox title="MathLang (2020)" link="https://github.com/mirrorkeydev/MathLang"
    subtitle="Programming Language Fundamentals Final Project" img="./assets/mathlang.png">
      A stack-based language that performs basic mathematic/logic operations. 
      Values include integers, doubles, booleans, tuples, commands, and functions.
      Can perform basic operations on values and allows conditional logic
      such as if/else statements and while/for loops.
    </ImageBox>

    <ImageBox title="Visualizations (2020)" link="https://github.com/mirrorkeydev/Visualizations"
    subtitle="Personal project" img="./assets/visualizations2.png">
      Various visualizations created as an exercise in data processing. Includes
      infographics and interactive charts, exploring data such as my Netflix
      binges and the patterns of texts to a friend.
    </ImageBox>

    <ImageBox title="CatSpot (2019)" link="https://github.com/mirrorkeydev/CatSpot"
    subtitle="Web Development Final Project" img="./assets/catspot2.png">
      A web app that allows students to track cat spottings on campus.
      Cats can be given names and assigned pictures, energy levels, sociability status,
      and a recent location. The interactive map shows cat spottings in the last 
      24 hours.
    </ImageBox>

    <ImageBox title="Appstract (2018)" link="https://github.com/mirrorkeydev/Appstract"
    subtitle="Personal project" img="./assets/appstract.png">
      An artistically abstract Android icon pack. 300+ icons supported across 25+ launchers.
      Built on the open source CandyBar dashboard. Available on the Google Play Store
      <a href="https://play.google.com/store/apps/details?id=com.melon.appstract&hl=en_US">here.</a>
    </ImageBox>

  </div>

</div>`;

import { ImageBox } from '../components/imagebox.js';

const Projects = {
    template: ProjectsTemplate,
    components: {
      'ImageBox': ImageBox,
    },
};

export { Projects };

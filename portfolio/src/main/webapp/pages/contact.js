/*
 * The contact page of the website.
 */

const ContactTemplate = 
`<div id="body-container">
    <TextBox>

    <h2 class="centered">Get in Touch!</h2>
    <br/>

    <div class="icontitle-group">
        
        <a class="icon-link" href="mailto:mirrorkeydev@gmail.com">
            <IconTitle icon="fas fa-envelope fa-2x">mirrorkeydev@gmail.com</IconTitle>
        </a>

        <a class="icon-link" href="https://www.linkedin.com/in/mgutzmann">
            <IconTitle icon="fab fa-linkedin-in fa-2x">linkedin.com/in/mgutzmann</IconTitle>
        </a>

        <a class="icon-link" href="https://github.com/mirrorkeydev">
            <IconTitle icon="fab fa-github fa-2x">github.com/mirrorkeydev</IconTitle>
        </a>

        <a class="icon-link" href="https://open.spotify.com/user/mirrorkey?si=HbKiiZDRRdCicNRs_qoKtg">
            <IconTitle icon="fab fa-spotify fa-2x">mirrorkey</IconTitle>
        </a>

        <div class="icon-link">
        <IconTitle icon="fab fa-discord fa-2x">mirrorkeydev#0120</IconTitle>
        </div>

    </div>

  </TextBox>
</div>`;

import { TextBox } from '../components/textbox.js';
import { IconTitle } from '../components/icontitle.js';

const Contact = {
    template: ContactTemplate,
    components: {
        'TextBox': TextBox,
        'IconTitle': IconTitle,
    },
};

export { Contact };

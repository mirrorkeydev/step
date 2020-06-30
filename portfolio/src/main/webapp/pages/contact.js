/*
 * The contact page of the website.
 */

const ContactTemplate = 
`<div id="body-container">

    <TextBox title="Get in Touch">
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

    <TextBox title="Comments">
        <form action="">
            <label>Number of results:</label>
            <select v-model="numComments" id="num-comments" name="num-comments">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="-1">all</option>
            </select>
        </form>
        <form action="/data" method="post" id="contact-form">
            <input type="text" id="name" name="name" placeholder="Name"><br>
            <textarea type="text" id="comment" name="comment" placeholder="Comment"></textarea>
            <input type="submit" value="Submit">
        </form>
        <Comment v-for="comment in comments" :author="comment.author" :date="comment.date"> {{ comment.body }} </Comment>
    </TextBox>
    
</div>`;

import { TextBox } from '../components/textbox.js';
import { IconTitle } from '../components/icontitle.js';
import { CommentBox } from '../components/commentbox.js';

const Contact = {
    data() {
        return {
            comments: [],
            numComments: 10,
        }
    },
    template: ContactTemplate,
    components: {
        'TextBox': TextBox,
        'IconTitle': IconTitle,
        'Comment': CommentBox,
    },
    async mounted() {
        // Get the comments from the server and add them to component's local state
        this.comments = await (await fetch('/data')).json();
    },
    watch: {
        // When the user picks a new number of comments, replace the comments with the new ones
        async numComments(newNum, oldNum) {
            console.log("I changed!")
            this.comments = await (await fetch('/data?num-comments=' + newNum)).json();
        }
    }
};

export { Contact };

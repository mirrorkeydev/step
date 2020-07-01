/*
 * The contact page of the website.
 */

const ContactTemplate = 
`<div id="body-container">

    <TextBox title="Get in Touch">
        <div class="icontitle-group" id="contact-group">
            
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

    <TextBox :title="this.comments.length + ' Comment' + (this.comments.length != 1 ? 's' : '')">
        <form @submit.prevent="addNewComment" id="contact-form">
            <input type="text" id="name" name="name" placeholder="Name" autocomplete="off" v-model="commentDraft.author"><br>
            <textarea type="text" id="comment" name="comment" placeholder="Comment" v-model="commentDraft.body"></textarea>
            <input type="submit" value="Submit">
        </form>
        <div v-if="this.error.length > 0" id="error-bar"> {{ error }} </div>
        <form id="num-comments-form">
        <label v-if="this.comments.length > 0" id="num-comments-label">Number of results:</label>
        <select v-if="this.comments.length > 0" v-model="numCommentsToShow" id="num-comments" name="num-comments">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="-1">all</option>
        </select>
        </form>
        <Comment v-for="comment in comments" :author="comment.author" :date="comment.date" :class="{ greyed: comment.greyed }">
            {{ comment.body }}
        </Comment>
        <button v-if="this.comments.length > 0" v-on:click="showConfirmationModal" id="delete-comments-button">
            Delete all comments
        </button>
    </TextBox>

    <Modal v-if="modalActive" title="Warning" option1="Nevermind" option2="Yup!" 
            @o1="modalActive = false" @o2="deleteAllComments">
        This action cannot be undone. Are you sure you want to continue?
    </Modal>
</div>`;

import { CommentBox } from '../components/commentbox.js';
import { IconTitle } from '../components/icontitle.js';
import { Modal } from '../components/modal.js';
import { TextBox } from '../components/textbox.js';

const Contact = {
    data() {
        return {
            comments: [],
            numCommentsToShow: 10,
            commentDraft: {
                author: "",
                body: "",
                date: Date.now(),
                greyed: false,
            },
            error: "",
            modalActive: false,
        }
    },
    template: ContactTemplate,
    components: {
        'Comment': CommentBox,
        'IconTitle': IconTitle,
        'Modal': Modal,
        'TextBox': TextBox,
    },
    methods: {
        // Adds a new comment to the list of comments by locally adding it, trying to add it to the server
        // quietly in the background, and removing it from the list and showing an error if failure occurs.
        async addNewComment() {
            // Blank slate
            this.error = "";

            // Validate content
            if (!this.commentDraft.body || this.commentDraft.body.length < 0) {
                this.error = "Please enter a comment.";
                return;
            }

            // First, add the comment locally to instantly show the change
            this.createNewLocalGreyedComment(this.commentDraft);

            // Then, try and add it to the server
            let vueInstance = this;
            try {
                const response = await fetch('/data', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: vueInstance.createSearchParamsFromObject(this.commentDraft),
                });
                if (!response.ok) {
                    throw new Error(response.status)
                } 
            }
            catch(err) {
		        vueInstance.removeLastComment();
                vueInstance.error = "Error trying to add comment: " + err;
                return;
            }

            // If we don't get an error, we can assume everything went well and un-grey out the comment
            this.comments[0].greyed = false;

            // Clear the text fields
            this.commentDraft.author = "";
            this.commentDraft.body = "";
        },
        // Creates the search parameters necessary to build a POST request manually
        createSearchParamsFromObject(obj){
            return Object.keys(obj).map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
                    }).join('&');
        },
        // Locally adds a comment to the lists of comments in a greyed-out "waiting" state
        createNewLocalGreyedComment(comment){
            comment.greyed = true;
            comment.author = !comment.author || comment.author === "" ? "Anonymous" : comment.author;
            comment.date = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', 
                                                                    hour: 'numeric', minute: 'numeric', second: 'numeric' });
            this.comments.unshift(Object.assign({}, comment));
        },
        // Removes the local comment that was most recently added
        removeLastComment(){
            this.comments.splice(0, 1);
        },
        // Opens the "are you sure?" modal
        showConfirmationModal() {
            this.modalActive = true;
        },
        // Deletes all comments from the server and then refreshes the visible comments
        async deleteAllComments(){

            // Close the modal if it was open
            this.modalActive = false;

            // Delete all comments from the server
            try {
                const response = await fetch('/delete-data', { method: 'POST'});
                if (!response.ok) {
                    throw new Error("Unable to delete comments. Please try again.")
                } 
            }
            catch(err) {
                console.warn(err)
            }

            // Refresh the comments that the user sees
            this.comments = await (await fetch('/data')).json();
        }
    },
    async mounted() {
        // Get the comments from the server and add them to component's local state
        this.comments = await (await fetch('/data')).json();
    },
    watch: {
        // When the user picks a new number of comments, adjust the list to show that many
        async numCommentsToShow(newNum, oldNum) {
            let castNewNum = Number(newNum);
            let castOldNum = Number(oldNum);

            // If the user requests more comments than we currently have locally,
            // then we need to ask the datastore for more
            if (castNewNum > castOldNum) {
                this.comments = await (await fetch('/data?num-comments=' + newNum)).json();
            }
            // Else, they're asking for an amount of comments that we already have locally,
            // so just show them the first n comments
            else if (castNewNum <= this.comments.length){
                this.comments = this.comments.slice(0, castNewNum);
            }
        },
    },
};

export { Contact };

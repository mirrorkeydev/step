/*
 * The contact page of the website.
 */

const ContactTemplate =
`<div id="body-container">

  <TextBox title="Get in Touch">
    <div class="icontitle-group" id="contact-group">
        
      <a class="icon-link" href="mailto:mirrorkeydev@gmail.com">
        <IconTitle icon="fas fa-envelope fa-2x">
          mirrorkeydev@gmail.com
        </IconTitle>
      </a>

      <a class="icon-link" href="https://www.linkedin.com/in/mgutzmann">
        <IconTitle icon="fab fa-linkedin-in fa-2x">
          linkedin.com/in/mgutzmann
        </IconTitle>
      </a>

      <a class="icon-link" href="https://github.com/mirrorkeydev">
        <IconTitle icon="fab fa-github fa-2x">
          github.com/mirrorkeydev
        </IconTitle>
      </a>

      <a class="icon-link" href="https://open.spotify.com/user/mirrorkey?si=HbKiiZDRRdCicNRs_qoKtg">
        <IconTitle icon="fab fa-spotify fa-2x">mirrorkey</IconTitle>
      </a>

      <div class="icon-link">
        <IconTitle icon="fab fa-discord fa-2x">mirrorkeydev#0120</IconTitle>
      </div>

    </div>
  </TextBox>

  <TextBox :title="commentBoxTitle">
    <form @submit.prevent="addNewComment" id="contact-form">
      <input type="text" id="name" name="name" placeholder="Name"
        autocomplete="off" v-model="commentDraft.author"><br>
      <textarea type="text" id="comment" name="comment"
        placeholder="Comment" v-model="commentDraft.body">
      </textarea>
      <input type="submit" value="Submit">
    </form>
    <div v-if="this.error.length > 0" id="error-bar"> {{ error }} </div>
    <div id="num-comments-form">
      <label v-if="this.comments.length > 0" id="num-comments-label">Translate to:</label>
      <select v-if="this.comments.length > 0" v-model="commentLangToShow"
          id="lang-comments" name="lang-comments">
        <option value="original">Original Language</option>
        <option value="ar">Arabic</option>
        <option value="bn">Bengali</option>
        <option value="zh">Chinese</option>
        <option value="en">English</option>
        <option value="de">German</option>
        <option value="hi">Hindi</option>
        <option value="ja">Japanese</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="es">Spanish</option>
      </select>
      <label v-if="this.comments.length > 0" id="num-comments-label">Number of results:</label>
      <select v-if="this.comments.length > 0" v-model="numCommentsToShow"
          id="num-comments" name="num-comments">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="-1">all</option>s
      </select>
    </div>
    <Comment v-for="comment in comments" :author="comment.author" :sentiment="comment.sentiment"
      :date="comment.date" :class="{ greyed: comment.greyed }">
      {{ comment.body }}
    </Comment>
    <button v-if="this.comments.length > 0" v-on:click="showConfirmationModal"
      id="delete-comments-button">
      Delete all comments
    </button>
  </TextBox>

  <Modal v-if="modalActive" title="Warning" option1="Nevermind" option2="Yup!" 
      @o1="modalActive = false" @o2="deleteAllComments">
    This action cannot be undone. Are you sure you want to continue?
  </Modal>
</div>`;

import {CommentBox} from '../components/commentbox.js';
import {IconTitle} from '../components/icontitle.js';
import {Modal} from '../components/modal.js';
import {TextBox} from '../components/textbox.js';

const Contact = {
  data() {
    return {
      // The comments that the user sees.
      comments: [],
      // The number of comments the user sees, dropdown defined.
      numCommentsToShow: -1,
      // The language to which to translate the comments, dropdown defined.
      commentLangToShow: 'en',
      // The total number of comments existing in the Datastore.
      serverNumComments: -1,
      // The comment that the user drafts in the text input fields.
      commentDraft: {
        author: '',
        body: '',
        date: Date.now(),
        greyed: false,
      },
      // Any errors that occur while saving the user's comment.
      error: '',
      // Whether or not the confirmation modal is displayed.
      modalActive: false,
      // The title above the comments box.
      commentBoxTitle: '',
    };
  },
  template: ContactTemplate,
  components: {
    'Comment': CommentBox,
    'IconTitle': IconTitle,
    'Modal': Modal,
    'TextBox': TextBox,
  },
  methods: {
    // Adds a new comment to the list of comments by locally adding it, trying to add it to
    // the server in the background, and removing it from the list if failure occurs.
    async addNewComment() {
      // Blank slate
      this.error = '';

      // Validate content
      if (!this.commentDraft.body || this.commentDraft.body.length < 0) {
        this.error = 'Please enter a comment.';
        return;
      }

      // First, add the comment locally to instantly show the change
      this.createNewLocalGreyedComment(this.commentDraft);

      // Then, try and add it to the server
      const vueInstance = this;
      let sentimentScore = 2;
      try {
        const response = await fetch('/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: vueInstance.createSearchParamsFromObject(this.commentDraft),
        });
        if (!response.ok) {
          throw new Error(response.status);
        } 
        else {
          sentimentScore = parseFloat(await response.text());
          if (sentimentScore <= -0.7){
            throw "Please reword your comment to be more constructive.";
          }
        }
      } catch (err) {
        vueInstance.removeLastComment();
        vueInstance.error = "Unable to add comment: " + err;
        console.warn(err);
        return;
      }

      // If we don't get an error, we can assume everything went well and un-grey out the comment
      this.comments[0].greyed = false;
      this.comments[0].sentiment = sentimentScore;

      // Clear the text fields
      this.commentDraft.author = '';
      this.commentDraft.body = '';
    },
    // Creates the search parameters necessary to build a POST request manually
    createSearchParamsFromObject(obj) {
      return Object.keys(obj).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
      }).join('&');
    },
    // Locally adds a comment to the lists of comments in a greyed-out "waiting" state.
    createNewLocalGreyedComment(comment) {
      comment.greyed = true;
      comment.author = !comment.author || comment.author === '' ? 'Anonymous' : comment.author;
      comment.date = new Date().toLocaleDateString('en-US',
          {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
          });
      comment.sentiment = 2;
      this.comments.unshift(Object.assign({}, comment));
      this.serverNumComments++;
    },
    // Removes the local comment that was most recently added.
    removeLastComment() {
      this.comments.splice(0, 1);
      this.serverNumComments--;
    },
    // Changes the "greyed" property of all comments to the passed-in value.
    greyAllComments(greyed) {
      for (const c of this.comments) {
        if (!c.greyed || c.greyed != greyed) {
          this.$set(c, 'greyed', greyed);
        }
      }
    },
    // Opens the "are you sure?" modal.
    showConfirmationModal() {
      this.modalActive = true;
    },
    // Deletes all comments from the server and then refreshes the visible comments.
    async deleteAllComments() {
      // Close the modal if it was open
      this.modalActive = false;

      // Delete all comments from the server
      try {
        const response = await fetch('/delete-data', {method: 'POST'});
        if (!response.ok) {
          throw new Error('Unable to delete comments. Please try again.');
        }
      } catch (err) {
        console.warn(err);
      }

      // Refresh the comments that the user sees
      this.comments = await (await fetch('/data?num-comments=' + this.numCommentsToShow +
        '&lang-comments=' + this.commentLangToShow)).json();
      this.serverNumComments = 0;
    },
  },
  async mounted() {
    // Get the comments from the server and add them to component's local state
    this.commentBoxTitle = 'Loading Comments ...';
    try {
      this.comments = await (await fetch('/data?num-comments=-1&lang-comments=en')).json();
      this.serverNumComments = this.comments.length;
    } catch (err) {
      console.warn(err);
    }
  },
  watch: {
    // When the user picks a new number of comments, adjust the list to show that many
    async numCommentsToShow(newNum, oldNum) {
      const castNewNum = Number(newNum);
      const castOldNum = Number(oldNum);

      // If the user requests more comments than we currently have locally,
      // then we need to ask the datastore for more
      if (castNewNum == -1 || castNewNum > castOldNum) {
        this.comments = await (await fetch('/data?num-comments=' + newNum +
          '&lang-comments=' + this.commentLangToShow)).json();
      } else if (castNewNum <= this.comments.length) {
        // Else, they're asking for an amount of comments that we already have locally,
        // so just show them the first n comments
        this.comments = this.comments.slice(0, castNewNum);
      }
    },
    // When the user picks a new comment language, rerun the comment query to show them
    async commentLangToShow(newLang, oldLang) {
      this.greyAllComments(true);
      this.comments = await (await fetch('/data?num-comments=' + this.numCommentsToShow +
        '&lang-comments=' + newLang)).json();
      this.greyAllComments(false);
    },
    // Update the commentbox title when the number of comments changes
    serverNumComments(newNum, oldNum) {
      this.commentBoxTitle = newNum + ' Comment' + (newNum != 1 ? 's' : '');
    },
  },
};

export {Contact};

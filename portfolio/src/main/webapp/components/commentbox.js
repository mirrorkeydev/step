/*
 * A comment left by a user.
 */

const CommentBoxTemplate =
`<div class="commentbox-container">
  <div class="commentbox-author">
    <div class="commentbox-status" :style="{ backgroundColor: statusColor }"></div> {{ author }}
  </div>
  <div class="commentbox-date"> {{ date }} UTC</div>
  <div class="commentbox-body">
    <slot></slot>
  </div>
</div>`;

const CommentBox = {
  template: CommentBoxTemplate,
  props: ['author', 'date', 'sentiment'],
  computed: {
      statusColor() {
        if (this.sentiment < -0.5) {
          return '#ff8383';
        }
        else if (this.sentiment < 0) {
          return '#ffd283';
        }
        else if (this.sentiment >= 0) {
          return '#abe658';
        }
        else {
          return '#fff';
        }
      }
  }
};

export {CommentBox};

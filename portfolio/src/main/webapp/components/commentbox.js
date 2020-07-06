/*
 * A comment left by a user.
 */

const CommentBoxTemplate =
`<div class="commentbox-container">
  <div class="commentbox-author"> {{ author }} </div>
  <div class="commentbox-date"> {{ date }} UTC</div>
  <div class="commentbox-body">
    <slot></slot>
  </div>
</div>`;

const CommentBox = {
  template: CommentBoxTemplate,
  props: ['author', 'date'],
};

export {CommentBox};

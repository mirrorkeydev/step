/*
 * A pop-up modal that gives the user two options
 */

const ModalTemplate = 
`<div class="modal-container">
    <h3 class="modal-title"> {{ title }} </h3>
    <div class="modal-text"><slot></slot></div>
    <div class="modal-buttons">
        <button @click="$emit('option1-clicked')" class="modal-button"> {{ option1 }} </button>
        <button @click="$emit('option2-clicked')" class="modal-button"> {{ option2 }} </button>
    </div>
</div>`;

const Modal = {
    props: ['title', 'option1', 'option2'],
    template: ModalTemplate,
};

export { Modal };

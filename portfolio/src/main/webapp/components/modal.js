/*
 * A pop-up modal that gives the user two options
 */

const ModalTemplate = 
`<div>
    <div class="modal-mask">
    </div>
    <div class="modal-container">
        <h3 class="modal-title"> {{ title }} </h3>
        <div class="modal-text"><slot></slot></div>
        <div class="modal-buttons">
            <button @click="$emit('o1')" class="modal-button"> {{ option1 }} </button>
            <button @click="$emit('o2')" class="modal-button"> {{ option2 }} </button>
        </div>
    </div>
</div>`;

const Modal = {
    props: ['title', 'option1', 'option2'],
    template: ModalTemplate,
};

export { Modal };

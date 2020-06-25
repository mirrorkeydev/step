const SimpleBoxTemplate = 
`<div>
    <div class="preview-title">{{ title }}</div>
    <div class="preview-container">
        <div class="preview-paragraph">
            <slot></slot>
        </div>
        <br/>
        <div class="preview-read-more">
            <router-link :to="url"> {{ moreText }} →</router-link>
        </div>
    </div>
</div>`;

const SimpleBox = {
    props: ['title', 'url', 'moreText'],
    template: SimpleBoxTemplate,
};

export { SimpleBox };

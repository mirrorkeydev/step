const PreviewBoxTemplate = 
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

const PreviewBox = {
    props: ['title', 'url', 'moreText'],
    template: PreviewBoxTemplate,
};

export { PreviewBox };

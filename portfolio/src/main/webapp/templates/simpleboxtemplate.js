const SimpleBoxTemplate = `
<div>
    <div class="preview-title">{{ title }}</div>
    <div class="preview-container">
        <div class="preview-paragraph">
            <slot></slot>
        </div>
        <br/>
        <div class="preview-read-more">
            <a :href="url"> {{ moreText }} →</a>
        </div>
    </div>
</div>
`;

export { SimpleBoxTemplate }
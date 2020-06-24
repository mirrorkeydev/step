const CaptionedImageTemplate = `
    <div class="preview-img-w-text">
            <div class="preview-img-text">
                <div class="preview-subtitle">
                {{ caption }}
                </div>
                <div class="preview-img-description">
                    <slot></slot>
                </div>
            </div>
        <img class="preview-img" :src="imgUrl" alt="Apptract icon">
    </div>
`;

const CaptionedImage = {
    props: ['caption', 'imgUrl'],
    template: CaptionedImageTemplate
}

export { CaptionedImage }
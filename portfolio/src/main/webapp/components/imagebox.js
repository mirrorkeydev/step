/*
 * A vertical box that contains a header image and
 * some text describing the box.
 */

const ImageBoxTemplate = 
`<div class="imagebox">
    <div class="imagebox-title"> {{ title }} </div>
    <div class="imagebox-subtitle"> {{ subtitle }} </div>
    <img class="imagebox-img" :src="img" alt="Project image/logo">
    <slot></slot>
</div>`;

const ImageBox = {
    props: ['title', 'subtitle', 'img'],
    template: ImageBoxTemplate,
};

export { ImageBox };

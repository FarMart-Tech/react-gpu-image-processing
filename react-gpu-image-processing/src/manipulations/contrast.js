import { GLView } from 'expo-gl';

import { createGL } from '../helpers/gl_utils';
import { vertShader as vertShaderSource } from '../shaders/staticvert';
import { fragShader as fragShaderSource } from '../shaders/contrast';



// Create a function that takes an image and a contrast level(float value) and returns a new image with the contrast adjusted.
async function changeContrast(image, contrast) {
    const gl = await createGL(vertShaderSource, fragShaderSource, image, { contrast })

    // we need to use flip option because framebuffer contents are flipped vertically
    const snapshot = await GLView.takeSnapshotAsync(gl, {
        flip: true,
    });

    return snapshot;
}

module.exports = { changeContrast };
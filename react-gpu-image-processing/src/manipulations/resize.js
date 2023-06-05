import { GLView } from 'expo-gl';
import { createGL } from '../helpers/gl_utils';
import { fragShader as fragShaderLanczosSource } from '../shaders/lanczos';
import { fragShader as fragShaderBilinearSource } from '../shaders/bilinear';
import { fragShader as fragShaderBicubicSource } from '../shaders/bicubic';
import { vertShader as vertShaderSource } from '../shaders/staticvert';





export default async function resizeImage(originalImage, outputWidth, outputHeight, method) {
    method = method || 'lanczos';
    let fragShaderSource = null;
    if (method == 'lanczos') {
        fragShaderSource = fragShaderLanczosSource
    } else if (method == 'bilinear') {
        fragShaderSource = fragShaderBilinearSource
    } else if (method == 'bicubic') {
        fragShaderSource = fragShaderBicubicSource
    }

    const gl = await createGL(vertShaderSource, fragShaderSource, originalImage, { width: originalImage.width, height: originalImage.height }, outputWidth, outputHeight);


    // we need to use flip option because framebuffer contents are flipped vertically
    const snapshot = await GLView.takeSnapshotAsync(gl, {
        flip: true,
    });

    return snapshot;
}

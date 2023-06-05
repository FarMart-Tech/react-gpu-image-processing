import { GLView } from 'expo-gl';


export async function createGL(vertShaderSource, fragShaderSource, image, uniforms, outputWidth, outputHeight) {
    var uniformDict = {}
    const gl = await GLView.createContextAsync()

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertShaderSource);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragShaderSource);
    gl.compileShader(fragShader);

    // Link, use program, save and enable attributes
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    gl.useProgram(program);

    for (let key in uniforms) {
        uniformDict[key] = gl.getUniformLocation(program, key);
    }

    // create framebuffer
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    // Create, bind, fill buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const verts = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    // Bind 'position' attribute
    const positionAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

    // set viewport
    var viewportH = image.height
    var viewportW = image.width
    if (outputHeight !== undefined) {
        viewportH = outputHeight;
    }
    if (outputWidth !== undefined) {
        viewportW = outputWidth;
    }

    gl.viewport(0, 0, viewportW, viewportH);

    // create output texture
    const outputTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, outputTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        viewportW,
        viewportH,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
    );

    // create input texture
    const inputTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, inputTexture);

    // attach texture to framebuffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);

    // set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    // fill up input texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(gl.getUniformLocation(program, 'inputImageTexture'), 1);

    gl.clearColor(0, 0, 0, 1);
    // tslint:disable-next-line: no-bitwise
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    for (let key in uniformDict) {
        gl.uniform1f(uniformDict[key], uniforms[key]);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.endFrameEXP();

    return gl;
}
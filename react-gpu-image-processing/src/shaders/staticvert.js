import { GLSL } from "gl-react";

export const vertShader = GLSL`#version 300 es
precision highp float;

in vec2 position;
out vec2 textureCoord;
void main() {
    vec2 clipSpace = (1.0 - 2.0 * position) * vec2(-1.0, -1.0);

    textureCoord = position;
    gl_Position = vec4(clipSpace, 0.0, 1.0);
}`;
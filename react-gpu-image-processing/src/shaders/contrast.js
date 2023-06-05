import { GLSL } from "gl-react";

export const fragShader = GLSL`#version 300 es
precision mediump float;

uniform sampler2D inputImageTexture;
uniform float contrast;

in vec2 textureCoord;
out vec4 fragColor;

void main() {
  vec4 textureColor = texture(inputImageTexture, textureCoord);
  vec3 rgb = (textureColor.rgb - vec3(0.5)) * contrast + vec3(0.5);

  fragColor = vec4(rgb, textureColor.a);
}`;
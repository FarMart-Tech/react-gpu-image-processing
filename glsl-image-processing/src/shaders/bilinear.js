import { GLSL } from "gl-react";

export const fragShader = GLSL`#version 300 es
precision highp float;

vec4 texture2D_bilinear(sampler2D sampler, vec2 tex_coord, vec2 tex_size) {
    vec2 unit_texel = 1.0 / tex_size;
    vec2 unnorm_tex_coord = (tex_coord * tex_size) - vec2(0.5);
    vec2 f = fract(unnorm_tex_coord);
    vec2 snap_tex_coord = (floor(unnorm_tex_coord) + vec2(0.5)) / tex_size;
    vec4 s1 = texture(sampler, snap_tex_coord);
    vec4 s2 = texture(sampler, snap_tex_coord + vec2(unit_texel.x, 0.));
    vec4 s3 = texture(sampler, snap_tex_coord + vec2(0., unit_texel.y));
    vec4 s4 = texture(sampler, snap_tex_coord + unit_texel);
    return mix(mix(s1, s2, f.x), mix(s3, s4, f.x), f.y);
}


in vec2 textureCoord;
uniform sampler2D inputImageTexture;
uniform float width;
uniform float height;
out vec4 fragColor;

void main() {
    vec4 color = texture2D_bilinear(inputImageTexture, textureCoord, vec2(width, height));
    fragColor = color;
}
`
import { GLSL } from "gl-react";

export const fragShader = GLSL`
#version 300 es
precision highp float;
const float B = 0.0; // Bicubic resampling coefficient

// Bicubic interpolation function
float interpolate(float x) {
    float absX = abs(x);
    float absX2 = absX * absX;
    float absX3 = absX * absX * absX;

    float weight = 0.0;
    if (absX <= 1.0) {
        weight = (B + 2.0) * absX3 - (B + 3.0) * absX2 + 1.0;
    } else if (absX <= 2.0) {
        weight = B * absX3 - 5.0 * B * absX2 + 8.0 * B * absX - 4.0 * B;
    }

    return weight;
}


in vec2 textureCoord;
uniform sampler2D inputImageTexture;
uniform float width;
uniform float height;
out vec4 fragColor;

void main() {
    // Compute the sub-pixel offset within a texel
    vec2 offset = 1.0/vec2(width, height);

    // Compute the four texels to sample
    vec2 texel0 = textureCoord - offset;
    vec2 texel1 = textureCoord;
    vec2 texel2 = textureCoord + offset;
    vec2 texel3 = textureCoord + 2.0 * offset;

    // Sample the four texels
    vec4 color0 = texture(inputImageTexture, texel0);
    vec4 color1 = texture(inputImageTexture, texel1);
    vec4 color2 = texture(inputImageTexture, texel2);
    vec4 color3 = texture(inputImageTexture, texel3);

    // Interpolate the colors in x-direction
    vec4 interpColorX = mix(
    mix(color0, color1, interpolate(textureCoord.x - texel0.x)),
    mix(color2, color3, interpolate(textureCoord.x - texel2.x)),
    interpolate(textureCoord.x - texel1.x)
);

    // Interpolate the colors in y-direction
    vec4 finalColor = mix(
    mix(color0, color1, interpolate(textureCoord.y - texel0.y)),
    mix(color2, color3, interpolate(textureCoord.y - texel2.y)),
    interpolate(textureCoord.y - texel1.y)
);

    // Output the final color
    fragColor = finalColor;
}

`


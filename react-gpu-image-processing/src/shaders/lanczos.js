import { GLSL } from "gl-react";

export const fragShader = GLSL`#version 300 es
precision highp float;

const float PI = 3.14159265359;

// The sinc function doesn't seem to work. TODO
float sinc(float x){
    float s = sign(x);
    float xadj = max(abs(x), 1e-10);
    x = s * xadj;
    return sin(x)/x;
}

float lanczos(float x, float radius) {
    if(x == 0.0) return 1.0;
    if (abs(x) < radius) {
        // return sinc(PI * x) * sinc(PI * x / radius);
        // return radius * sin(PI * x) * sin(PI * x / radius);
        return (radius * sin(PI * x) * sin(PI * x / radius))  / (PI * PI * x * x);
    }
    return 0.0;
}
in vec2 textureCoord;
uniform sampler2D inputImageTexture;
uniform float width;
uniform float height;
out vec4 fragColor;

void main() {
    // Example usage
    float radius = 1.0;
    vec2 offset;
    vec2 unit_texel = 1.0/vec2(width, height);
    vec4 local_texture;
    float vec_length;
            
    
    // Sample the texture using the Lanczos kernel
    vec4 color = vec4(0.0);
    for (float x = -radius; x <= radius; x += 1.0) {
        for (float y = -radius; y <= radius; y += 1.0) {
            offset = vec2(x, y) * unit_texel;
            local_texture = texture(inputImageTexture, textureCoord + offset);
            vec_length = sqrt(x*x + y*y);
            color +=  local_texture * lanczos(vec_length, radius);
        }
    }
    fragColor = vec4(color.rgb, 1.0);
}
`
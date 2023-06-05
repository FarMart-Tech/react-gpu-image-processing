import { GLSL } from "gl-react";

export const diamond_crop_shader = {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
void main() {
gl_FragColor = mix(
  texture2D(t, uv),
  vec4(0.0),
  step(0.5, abs(uv.x - 0.5) + abs(uv.y - 0.5))
);
}`,
}

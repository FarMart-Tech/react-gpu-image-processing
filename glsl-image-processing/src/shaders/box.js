import { GLSL } from "@opencollabnexus/gl-react-new";

export const box_shader = {
  frag: GLSL`
    // #version 300 es
    precision highp float;

    float get_contrib(float i, float minimum, float maximum){
        float r_contrib = 0.0;
        float l_contrib = 0.0;

        if(i >= maximum){
            if(floor(i) != floor(maximum)){
                return 0.0;
            }else{
                i = maximum;
            }
        }

        if(i < maximum){
            float floor_i = floor(i);
            float frac_i =  i - floor_i;
            float ceil_i = floor_i + 1.0;
            if(frac_i == 0.0){
                ceil_i = i + 1.0;
            } 
            r_contrib = min(ceil_i - i, maximum - i);
            l_contrib = min(i - minimum, i - floor(i));
        } else if(i == maximum){
            float frct = fract(maximum);
            l_contrib = frct;
        }

        return r_contrib + l_contrib;
    }

    vec2 get_tex_coordinate(vec2 tex_coord_raw, vec2 s_size){
        tex_coord_raw -= vec2(0.5);
        return (floor(tex_coord_raw) + vec2(0.5)) / s_size;
    }

    vec3 texture2D_box(sampler2D sampler, vec2 tex_coord, vec2 s_size, vec2 fx_fy) {
        vec2 unit_texel = 1.0 / s_size;
        vec2 unnorm_tex_coord = tex_coord * s_size; // center coordinate of the box in the texture space
        vec2 box_bottom_left = unnorm_tex_coord - fx_fy / 2.0;
        vec2 box_top_right = unnorm_tex_coord + fx_fy / 2.0;


        vec3 color = vec3(0.0);

        for(float i = 0.0; i < {f_x} + 1.0; i++){
            float iabs = i + box_bottom_left.x;
            float contrib_i = get_contrib(iabs, box_bottom_left.x, box_top_right.x);
            for(float j = 0.0 ; j < {f_y} + 1.0; j++){
                float jabs = j + box_bottom_left.y;
                vec3 texij = texture2D(sampler, vec2(iabs, jabs)/s_size).xyz;
                float contrib_j = get_contrib(jabs, box_bottom_left.y, box_top_right.y);
                color += texij * contrib_i * contrib_j;
            }
        }

        color = color / (fx_fy.x * fx_fy.y);


        return color;

    }

    
    varying vec2 uv;
    uniform sampler2D t;
    uniform float s_width;
    uniform float s_height;
    const float f_x = {f_x}; // f_x = src_width / dest_width
    const float f_y = {f_y}; // f_y = src_height / dest_height
    

    void main() {
        vec3 color = texture2D_box(t, uv, vec2(s_width, s_height), vec2(f_x, f_y));
        gl_FragColor = vec4(color, 1.0);
    }
    `,
};

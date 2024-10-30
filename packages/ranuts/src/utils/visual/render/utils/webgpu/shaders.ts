/**
 * 顶点着色器
 */
export const vertexShaderSource = /* wgsl */ `
@group(0) @binding(0) var<uniform> u_root_transform: mat3x3<f32>;
@group(0) @binding(1) var<uniform> u_projection_matrix: mat3x3<f32>;

struct VertOutput {
  @builtin(position) v_position: vec4<f32>,
  @location(0) v_color : vec4<f32>,
};

@vertex
fn main(
  @location(0) a_position: vec2<f32>,
  @location(1) a_color: vec4<f32>,
) -> VertOutput {
  let v_position = vec4<f32>((u_projection_matrix * u_root_transform * vec3<f32>(a_position, 1.0)).xy, 0.0, 1.0);

  let v_color = a_color;

  return VertOutput(v_position, v_color);
}
`;

/**
 * 片元着色器
 */
export const fragmentShaderSource = /* wgsl */ `
@fragment
fn main(
  @location(0) v_color : vec4<f32>,
) -> @location(0) vec4<f32> {
  return v_color;
}
`;

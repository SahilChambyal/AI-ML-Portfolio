/**
 * Shared GLSL for the particle systems. One draw call per system; all
 * motion is computed in the vertex shader from uTime, so the render loop
 * allocates nothing and uploads nothing per frame.
 */

export const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uMaxSize;
  uniform float uDrift;

  attribute float aRand;   // stable per-particle random, 0..1
  attribute float aMix;    // color blend factor, 0..1

  varying float vMix;
  varying float vTwinkle;

  void main() {
    vMix = aMix;

    // Slow sinusoidal drift, phase-shifted per particle. amp in world units.
    vec3 p = position;
    float ph = aRand * 6.28318;
    p.x += sin(uTime * 0.12 + ph) * uDrift;
    p.y += sin(uTime * 0.09 + ph * 1.7) * uDrift * 0.6;
    p.z += cos(uTime * 0.10 + ph * 0.9) * uDrift * 0.8;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    vTwinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aRand) + ph * 3.0);
    // Attenuate with depth but clamp hard — a particle drifting past the
    // lens must read as dust, never as a balloon.
    gl_PointSize = min(uSize * (0.5 + aRand) * (180.0 / max(-mv.z, 0.1)), uMaxSize);
  }
`;

export const pointsFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  varying float vMix;
  varying float vTwinkle;

  void main() {
    // Soft round sprite — no texture fetch.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.08, d) * uOpacity * vTwinkle;
    if (alpha < 0.01) discard;
    vec3 color = mix(uColorA, uColorB, vMix);
    gl_FragColor = vec4(color, alpha);
  }
`;

export const fresnelVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPulse; // displacement amplitude

  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    // Breathing displacement along the normal — the core feels alive
    // without any noise-texture cost.
    float swell = sin(uTime * 0.8 + position.y * 2.0 + position.x * 1.5) * uPulse;
    vec3 p = position + normal * swell;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const fresnelFragment = /* glsl */ `
  uniform vec3 uBg;
  uniform vec3 uPrimary;
  uniform vec3 uAccent;
  uniform float uDark; // 1 dark palette, 0 light

  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    // Classic fresnel rim: facing-away fragments catch the primary color,
    // grazing edges flash the accent. Body sits near the page background
    // so the form reads as carved out of the page itself.
    float fr = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.0);

    vec3 body = mix(uBg, uPrimary, 0.12 + 0.1 * uDark);
    vec3 color = mix(body, uPrimary, smoothstep(0.15, 0.85, fr));
    color = mix(color, uAccent, smoothstep(0.75, 1.0, fr) * 0.85);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const gridVertex = /* glsl */ `
  varying vec3 vWorld;

  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const gridFragment = /* glsl */ `
  uniform vec3 uBg;
  uniform vec3 uLine;
  uniform float uOpacity;

  varying vec3 vWorld;

  void main() {
    // Anti-aliased world-space grid (fwidth), fading radially so the
    // floor dissolves before it can read as a literal edge.
    vec2 coord = vWorld.xz / 2.0;
    vec2 g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = 1.0 - min(min(g.x, g.y), 1.0);

    float radial = 1.0 - smoothstep(8.0, 46.0, length(vWorld.xz - vec2(0.0, -18.0)));
    float alpha = line * radial * uOpacity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(uBg, uLine, 0.85), alpha);
  }
`;

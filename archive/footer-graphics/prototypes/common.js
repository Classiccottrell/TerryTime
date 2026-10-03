// Shared helpers for the Terry WebGL prototypes (WebGL2, no dependencies).
export const INK = [0x12 / 255, 0x33 / 255, 0xc7 / 255];
export const PAPER = [0xf7 / 255, 0xf6 / 255, 0xf1 / 255];
export const MISREG = [0.95, 0.27, 0.42]; // second plate (warm red) for misregistration

export function initGL(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL2 unavailable');
  gl.getExtension('EXT_color_buffer_float');
  gl.getExtension('OES_texture_float_linear');
  return gl;
}

export function program(gl, vs, fs) {
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src);
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
  return { p, u };
}

export const QUAD_VS = `#version 300 es
in vec2 a; out vec2 vUv;
void main(){ vUv = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }`;

export function quad(gl) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  return () => { gl.bindVertexArray(vao); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
}

export function target(gl, w, h, { internal = gl.RGBA16F, format = gl.RGBA, type = gl.HALF_FLOAT, filter = gl.LINEAR } = {}) {
  const make = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb };
  };
  let a = make(), b = make();
  return { w, h, get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } };
}

/** Blurred ink-coverage height map of the Terry face as a single-channel texture (0..1). */
export function faceTexture(gl, img, size = 256, blurPasses = 2) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, size, size);
  x.drawImage(img, size * 0.05, size * 0.05, size * 0.9, size * 0.9);
  const d = x.getImageData(0, 0, size, size).data;
  let f = new Float32Array(size * size);
  for (let i = 0; i < f.length; i++) f[i] = 1 - (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 765;
  const at = (v) => Math.min(size - 1, Math.max(0, v));
  for (let p = 0; p < blurPasses; p++) {
    const t = new Float32Array(f.length), o = new Float32Array(f.length);
    for (let y = 0; y < size; y++) for (let xx = 0; xx < size; xx++) t[y * size + xx] = (f[y * size + at(xx - 1)] + f[y * size + xx] + f[y * size + at(xx + 1)]) / 3;
    for (let y = 0; y < size; y++) for (let xx = 0; xx < size; xx++) o[y * size + xx] = (t[at(y - 1) * size + xx] + t[y * size + xx] + t[at(y + 1) * size + xx]) / 3;
    f = o;
  }
  let max = 0; for (const v of f) max = Math.max(max, v);
  // Flip Y so texture v=0 is the bottom of the image (GL convention).
  const flipped = new Float32Array(f.length);
  for (let y = 0; y < size; y++) for (let xx = 0; xx < size; xx++) flipped[(size - 1 - y) * size + xx] = f[y * size + xx] / (max || 1);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, size, size, 0, gl.RED, gl.FLOAT, flipped);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { tex, data: flipped, size };
}

export function loadImage(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}

/** Pointer in canvas pixels (GL y-up) plus per-frame velocity. */
export function trackPointer(canvas) {
  const p = { x: 0, y: 0, dx: 0, dy: 0, down: false, active: false, moved: false };
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = r.height - (e.clientY - r.top);
    if (p.active) { p.dx += x - p.x; p.dy += y - p.y; }
    p.x = x; p.y = y; p.active = true; p.moved = true;
  });
  canvas.addEventListener('pointerleave', () => { p.active = false; });
  return p;
}

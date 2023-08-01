import * as THREE from "three";

/**
 * Create a custom shader material for a textured globe.
 * @param texture - The texture to apply to the globe.
 * @returns A THREE.ShaderMaterial with the provided texture.
 */
export const createTextureGlobeMaterial = (texture: THREE.Texture): THREE.ShaderMaterial => {
    return new THREE.ShaderMaterial({
        uniforms: {
            texture1: { value: texture },
        },
        vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
        fragmentShader: `
        precision highp float;
        const float PI = 3.1415926535897932384626433832795;
        uniform sampler2D texture1;
        varying vec2 vUv;

        // Convert longitude-latitude coordinates to Mercator projection.
        vec2 mercator(vec2 lonLat) {
            float lon = lonLat.x;
            float lat = lonLat.y;
            float x = (lon + PI) / (2.0 * PI);
            float y = 0.5 - log((1.0 + sin(lat)) / (1.0 - sin(lat))) / (4.0 * PI);
            y = 1.0 - y; // Flip the texture vertically.
            return vec2(x, y);
        }

        void main() {
            // Map the UV coordinates to the Mercator projection.
            vec2 uv = mercator(vUv * vec2(2.0 * PI, PI) - vec2(PI, PI * 0.5));

            // Fetch the color from the texture at the mapped UV coordinates.
            vec4 color = texture2D(texture1, uv);

            // Set the fragment color to the fetched color.
            gl_FragColor = color;
        }`,
    });
};

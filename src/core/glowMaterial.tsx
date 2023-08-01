import * as THREE from "three";

/**
 * Create a shader material for an outer glow effect around an object.
 * @param camera - The camera used to view the scene.
 * @returns A THREE.ShaderMaterial with an outer glow effect.
 */
export function getGlowMaterial({ camera }: { camera: THREE.Camera }): THREE.ShaderMaterial {
    // @TODO IDK what im doing, it looks OK but could be better.
    // Define the shader material properties.
    return new THREE.ShaderMaterial({
        uniforms: {
            // Color of the glow.
            glowColor: { type: "c", value: new THREE.Color(0xd9f8fe) } as any,

            // Position of the camera in the scene.
            viewVector: { type: "v3", value: camera.position } as any,
        },
        vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            float dotProduct = max(0.0, dot(vNormal, vNormel));
            intensity = pow(0.2 + dotProduct * 5.0, 0.02) * 0.9;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.6);
        }`,
        fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
            float alpha = 1.0 - intensity;
            gl_FragColor = vec4(glowColor, alpha);
        }`,
        side: THREE.BackSide,
        blending: THREE.NormalBlending,
        transparent: true,
    });
}

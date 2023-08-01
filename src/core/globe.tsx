import React, { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getCanvasTexture } from "./texture";
import { throttle } from "./throttle";
import { createTextureGlobeMaterial } from "./shader";
import { getGlowMaterial } from "./glowMaterial";
import { useAsyncEffect } from "./helper";

/**
 * React component representing a 3D globe with interactive controls.
 */
export const Globe: React.FC = () => {
    // A reference to the div where the 3D globe will be rendered.
    const mountRef = useRef<HTMLDivElement | null>(null);

    useAsyncEffect(async () => {
        const mount = mountRef.current;

        if (!mount) return;

        let running = true;

        // Create a new scene.
        const scene = new THREE.Scene();

        // Create a new camera with perspective projection.
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.0001, 1000);
        camera.position.z = 2;

        // Create a new WebGL renderer.
        const renderer = new THREE.WebGLRenderer();
        renderer.setClearAlpha(0);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Initialize orbit controls to allow user interaction with the globe.
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.02;
        controls.panSpeed = 0.5;
        controls.zoomSpeed = 0.1;
        controls.rotateSpeed = 0.001;
        controls.minDistance = 1.01;
        controls.maxDistance = 2;
        controls.minPolarAngle = -(Math.PI / (1 / 4));

        const minRotateSpeed = 0.03;
        const maxRotateSpeed = 0.7;
        controls.rotateSpeed = maxRotateSpeed;

        // Create the 3D globe.
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const textureCanvas = getCanvasTexture({ zoom: 4 });
        const texture = new THREE.CanvasTexture(textureCanvas.canvas);
        const material = createTextureGlobeMaterial(texture);
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Update the globe texture as we download more of the map.
        textureCanvas.onchange = throttle((canvas) => {
            const newTexture = new THREE.CanvasTexture(canvas);
            (sphere.material.uniforms as any).texture1.value = newTexture;
            sphere.material.needsUpdate = true;
        }, 50);

        // Create an outer glow effect around the globe.
        const glowMaterial = getGlowMaterial({ camera });
        let glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
        glowMesh.scale.multiplyScalar(1.2); // Size of the glow effect.
        scene.add(glowMesh);

        // Function to update the rotation speed of the globe based on camera distance.
        const updateRotateSpeed = () => {
            const distance = controls.object.position.distanceTo(controls.target);
            const t = (distance - controls.minDistance) / (controls.maxDistance - controls.minDistance);
            controls.rotateSpeed = THREE.MathUtils.lerp(maxRotateSpeed, minRotateSpeed, 1 - t);
        };

        // Animation loop to continuously render the scene.
        (function animate() {
            if (!running) return;
            requestAnimationFrame(animate);

            updateRotateSpeed();
            controls.update();
            renderer.render(scene, camera);
        })();

        // Function to handle window resize and update camera aspect ratio and renderer size.
        const handleWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleWindowResize);

        // Mount the renderer in the provided div element.
        mount.innerHTML = "";
        mount.appendChild(renderer.domElement);

        // Cleanup function to stop the animation loop and remove the globe from the scene.
        return () => {
            running = false;
            window.removeEventListener("resize", handleWindowResize);
            scene.remove(sphere);
        };
    }, [mountRef]);

    return <div ref={mountRef} />;
};

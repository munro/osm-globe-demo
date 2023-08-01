import React, { useRef } from "react";
import { getImage, useAsyncEffect } from "./helper";

/**
 * The width and height of an OpenStreetMap (OSM) tile patch in pixels.
 * OSM uses tiles with dimensions of 256x256 pixels.
 */
const WIDTH: number = 256;
const HEIGHT: number = 256;

/**
 * Type representing a canvas texture.
 */
export type CanvasTextureType = {
    canvas: HTMLCanvasElement;
    onchange: ((canvas: HTMLCanvasElement) => void) | null;
};

/**
 * Function to generate a canvas texture using images from a tile server.
 * @param zoom - The zoom level of the texture.
 * @returns A CanvasTextureType object with the canvas and onchange callback.
 * @throws An error if the canvas context cannot be obtained.
 */
export const getCanvasTexture = ({ zoom = 2 }: { zoom: number }): CanvasTextureType => {
    const zoomLength = Math.pow(2, zoom);

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH * zoomLength;
    canvas.height = HEIGHT * zoomLength;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error('canvas.getContext("2d"): could not get canvas context');
    }

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH * zoomLength, HEIGHT * zoomLength);

    // Object to store the canvas and the onchange callback.
    let obj: CanvasTextureType = {
        canvas: canvas,
        onchange: null,
    };

    // Fetch and draw images from the tile server asynchronously.
    (async () => {
        const steps = [...new Array(zoomLength)].map((_, index) => index);

        const outerImages = steps.map((x) => {
            const innerImgs = steps.map(async (y) => {
                const img = await getImage(`https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`);
                ctx.drawImage(img, WIDTH * x, HEIGHT * y);

                // Call onchange callback if provided.
                if (obj.onchange) {
                    obj.onchange(canvas);
                }
                return img;
            });
            return Promise.all(innerImgs);
        });

        const allImgs = await Promise.all(outerImages);

        allImgs.forEach((imgs, x) => {
            imgs.forEach((img, y) => {
                ctx.drawImage(img, WIDTH * x, HEIGHT * y);
            });
        });
    })().catch(console.error);

    return obj;
};

/**
 * React component for displaying a debug texture.
 */
export const DebugTexture: React.FC = () => {
    const divRef = useRef<HTMLDivElement | null>(null);

    // Use async effect to generate and display the canvas texture.
    useAsyncEffect(async () => {
        const div = divRef.current;
        if (!div) return;

        const texture = getCanvasTexture({ zoom: 5 });
        div.appendChild(texture.canvas);

        return () => {
            div.removeChild(texture.canvas);
        };
    }, []);

    return <div ref={divRef} id="wtf" />;
};

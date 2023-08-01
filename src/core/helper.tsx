import { useEffect, DependencyList } from "react";
import { Semaphore } from "./semaphore";

// Create a semaphore with a limit of 3 concurrent requests.
const semaphore = new Semaphore(3);

/**
 * Custom hook for running an asynchronous effect with optional dependencies.
 * @param effect - An asynchronous function representing the effect to run.
 * @param dependencies - An optional array of dependencies for the effect.
 */
export const useAsyncEffect = (
    effect: () => Promise<void | (() => void | undefined)>,
    dependencies?: DependencyList
): void => {
    useEffect(() => {
        const cleanupPromise = effect();
        cleanupPromise.catch(console.error);
        return () => {
            cleanupPromise.then((cleanup) => cleanup && cleanup());
        };
    }, [effect, dependencies]);
};

/**
 * Function to asynchronously fetch and resolve an image from the given URL.
 * @param url - The URL of the image to fetch.
 * @returns A Promise that resolves to the fetched HTMLImageElement.
 */
export const getImage = async (url: string): Promise<HTMLImageElement> => {
    const response = await getImageResponse(url);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = reject;
        img.src = objectURL;
    });
};

/**
 * Function to fetch an image from the cache or download and cache it if not already cached.
 * @param url - The URL of the image to fetch.
 * @returns A Promise that resolves to the fetched Response.
 */
async function getImageResponse(url: string): Promise<Response> {
    const cache = await caches.open("image-cache"); // Open (or create) the cache.
    let response = await cache.match(url); // Try to find the image in the cache.
    if (!response) {
        // If the image is not in the cache, download and cache it.
        response = await downloadAndCacheImage(url);
    }
    return response;
}

/**
 * Function to download and cache an image.
 * @param url - The URL of the image to download.
 * @returns A Promise that resolves to the fetched Response.
 */
async function downloadAndCacheImage(url: string): Promise<Response> {
    const cache = await caches.open("image-cache"); // Open (or create) the cache.

    // Use a semaphore to limit concurrent image downloads.
    await semaphore.acquire();

    try {
        const response = await fetch(url); // Fetch the image.

        if (isCacheable(response)) {
            // If the image is cacheable, add a clone of the response to the cache.
            // Note that a Response can only be used once, so we need to clone it.
            cache.put(url, response.clone());
        }

        return response;
    } finally {
        semaphore.release();
    }
}

/**
 * Function to check if a given response is cacheable (status code 200 and content type starting with "image/").
 * @param response - The response to check for cacheability.
 * @returns True if the response is cacheable, false otherwise.
 */
function isCacheable(response: Response): boolean {
    if (response.status === 200 && response.headers.get("Content-Type")?.startsWith("image/")) {
        return true;
    }
    return false;
}

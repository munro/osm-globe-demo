type Procedure = (...args: any[]) => void;

/**
 * A higher-order function that creates a throttled version of the provided function.
 * @param func - The function to be throttled.
 * @param delay - The time in milliseconds to throttle the function execution.
 * @returns A throttled version of the original function.
 */
export function throttle(func: Procedure, delay: number): Procedure {
    let lastFunc: NodeJS.Timeout | null = null;
    let lastRan: number = 0;

    /**
     * The throttled function that limits the execution of the original function.
     * @param args - The arguments to be passed to the original function.
     */
    return function (...args: any[]) {
        const now = Date.now();
        if (!lastRan) {
            func(...args);
            lastRan = now;
        } else {
            if (lastFunc) {
                clearTimeout(lastFunc);
            }
            lastFunc = setTimeout(() => {
                if (now - lastRan >= delay) {
                    func(...args);
                    lastRan = now;
                }
            }, delay - (now - lastRan));
        }
    };
}

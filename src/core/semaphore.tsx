/**
 * A simple semaphore implementation to control concurrent access to a resource.
 */
export class Semaphore {
    private tasks: (() => void)[] = [];
    private counter: number;

    /**
     * Create a new semaphore with the specified initial counter value.
     * @param counter - The initial counter value representing the number of permits available.
     */
    constructor(counter: number) {
        this.counter = counter;
    }

    /**
     * Acquire a permit from the semaphore.
     * If a permit is available, the method returns immediately.
     * Otherwise, it waits until a permit becomes available.
     * @returns A Promise that resolves when a permit is acquired.
     */
    async acquire(): Promise<void> {
        if (this.counter > 0) {
            this.counter--;
            return Promise.resolve();
        } else {
            // Wait until a permit is available.
            return new Promise<void>((resolve) => this.tasks.push(resolve));
        }
    }

    /**
     * Release a permit back to the semaphore.
     * If there are pending tasks waiting for permits, one of them will be notified and acquire the permit.
     * Otherwise, the counter is incremented, indicating an available permit.
     */
    release(): void {
        if (this.tasks.length > 0) {
            const next = this.tasks.shift();
            if (next) {
                next();
            }
        } else {
            this.counter++;
        }
    }
}

import CustomWorker from "./CustomWorker";

/**
 * Class representing a worker pool.
 * Use as a solution to the issue seen on vercel,
 * where all the new workers start with network request,
 * making the general solution more conquerent than parallel.
 */
export default class WorkerPool {
    private workers: CustomWorker[];
    private idleWorkers: CustomWorker[];
    private taskQueue: {
        message: any;
        resolve: (value: string) => void;
        reject: (reason?: any) => void;
    }[];

    /**
     * Constructs a new WorkerPool instance with the specified size.
     *
     * @param {number} size - The number of workers in the pool.
     */
    constructor(public size: number) {
        this.size = size;
        this.workers = [];
        this.idleWorkers = [];
        this.taskQueue = [];

        for (let i = 0; i < size; i++) {
            const worker = new CustomWorker();

            worker.onmessage = (e: MessageEvent) => this.onMessage(worker, e);
            worker.onerror = (e: ErrorEvent) => this.onError(worker, e);
            this.workers.push(worker);
            this.idleWorkers.push(worker);
        }
    }
    /**
     * Handles the onMessage event from a worker.
     *
     * @param {CustomWorker} worker - The worker that sent the message.
     * @param {MessageEvent} e - The message event.
     * @return {void} This function does not return anything.
     */
    private onMessage(worker: CustomWorker, e: MessageEvent): void {
        if (worker.currentTask) {
            // Added check
            const { resolve, reject } = worker.currentTask;
            if (e.data.error) {
                reject(new Error(e.data.error));
            } else {
                resolve(e.data.stringify);
            }
            worker.currentTask = null; // Clear currentTask
            this.runNextTask(worker);
        }
    }

    /**
     * Handles the onError event from a worker.
     *
     * @param {CustomWorker} worker - The worker that encountered the error.
     * @param {ErrorEvent} e - The error event.
     * @return {void} This function does not return anything.
     */
    private onError(worker: CustomWorker, e: ErrorEvent): void {
        if (worker.currentTask) {
            // Added check
            const { reject } = worker.currentTask;
            reject(new Error(`Worker error: ${e.message}`));
            worker.currentTask = null; // Clear currentTask
            this.runNextTask(worker);
        }
    }

    /**
     * Runs the next task for the worker if there are tasks in the task queue.
     * If the task queue is empty, the worker is added to the idle workers list.
     *
     * @param {CustomWorker} worker - The worker to run the next task for.
     */
    private runNextTask(worker: CustomWorker) {
        if (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift()!;
            this.runTask(worker, task);
        } else {
            this.idleWorkers.push(worker);
        }
    }

    /**
     * Runs a task on a worker by assigning the task to the worker and sending the task message.
     *
     * @param {CustomWorker} worker - The worker on which the task will be run.
     * @param {Object} task - The task object containing the message, resolve, and reject functions.
     * @param {any} task.message - The message to be sent to the worker.
     * @param {Function} task.resolve - The function to be called when the task is successfully resolved.
     * @param {Function} task.reject - The function to be called when the task encounters an error.
     */
    private runTask(
        worker: CustomWorker,
        task: {
            message: any;
            resolve: (value: string) => void;
            reject: (reason?: any) => void;
        }
    ) {
        worker.currentTask = task;
        worker.postMessage(task.message);
    }

    /**
     * Adds a task to the task queue and returns a promise that resolves to a string.
     * If there are idle workers available, the task is assigned to the worker immediately.
     * Otherwise, the task is added to the task queue.
     *
     * @param {any} message - The message to be passed to the worker.
     * @return {Promise<string>} A promise that resolves to a string when the task is completed.
     */
    public addTask(message: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const task = { message, resolve, reject };
            if (this.idleWorkers.length > 0) {
                const worker = this.idleWorkers.shift()!;
                this.runTask(worker, task);
            } else {
                this.taskQueue.push(task);
            }
        });
    }

    /**
     * Terminates all workers in the pool.
     *
     * @return {void} This function does not return anything.
     */
    public terminateAll(): void {
        this.workers.forEach((worker) => worker.terminate());
    }
}

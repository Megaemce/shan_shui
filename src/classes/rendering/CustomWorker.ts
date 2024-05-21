export default class CustomWorker extends Worker {
    public currentTask: {
        message: any;
        resolve: (value: string) => void;
        reject: (reason?: any) => void;
    } | null = null;

    constructor() {
        super(new URL("../../utils/layerWorker", import.meta.url));
    }
}

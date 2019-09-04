export class Debug {
    private static logs = {};
    private static interval: any;

    static addLog(key: string, obj: any[]) {
        Debug.logs[key] = obj;

        if (!Debug.interval) {
            Debug.interval = setInterval(() => Debug.showLogs(), 1000);
        }
    }

    static showLogs() {
        for (const key of Object.keys(Debug.logs)) {
            const obj = Debug.logs[key];
            console.log(key, ...obj);
        }
    }


}
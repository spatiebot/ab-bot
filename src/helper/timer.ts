export class StopWatch {
    private startTime: number;
    
    start() {
        this.startTime = Date.now();
    }

    isStarted(): boolean {
        return !!this.startTime;
    }

    elapsedMs() {
        return Date.now() - this.startTime;
    }

    elapsedSeconds() {
        return this.elapsedMs() / 1000;
    }
}
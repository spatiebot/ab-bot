export class TimeoutManager {
    private timeouts = [];

    setTimeout(action: () => void, ms) {
        const id = setTimeout(() => {
            this.onTimeoutFinished(id);
            action();
        }, ms);
        this.timeouts.push(id);
        return id;
    }

    clearTimeout(id): void {
        clearTimeout(id);
        this.onTimeoutFinished(id);
    }

    private onTimeoutFinished(id) {
        this.timeouts = this.timeouts.filter(x => x !== id);
    }

    clearAll() {
        for (let i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
    }
}
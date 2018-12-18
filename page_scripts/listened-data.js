class ListenedData {
    constructor() {
        this.listeners = [];
        this.addListener = this.addListener.bind(this);
        this.notifyAll = this.notifyAll.bind(this);
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    notifyAll() {
        this.listeners.forEach(function(item) {
            item();
        });
    }
}
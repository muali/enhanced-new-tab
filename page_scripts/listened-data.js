function ListenedData() {

    this.listeners = [];

    this.addListener = function(listener) {
        this.listeners.push(listener)
    };

    this.onUpdate = function() {
        for (var i = 0; i < this.listeners.length; ++i) {
            this.listeners[i]();
        }
    };

    return this;
}
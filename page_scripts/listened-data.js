// function ListenedData() {

//     this.listeners = [];

//     this.addListener = function(listener) {
//         this.listeners.push(listener)
//     };

//     this.onUpdate = function() {
//         for (var i = 0; i < this.listeners.length; ++i) {
//             this.listeners[i]();
//         }
//     };

//     return this;
// }

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
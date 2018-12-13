class History extends ListenedData {
    constructor() {
        super();
        this.urls = [];
        this.onHistoryResponce = this.onHistoryResponce.bind(this);
        this.update = this.update.bind(this);

        this.update();
    }

    onHistoryResponce(historyItems) {
        this.urls = [];
        historyItems.forEach(item => this.urls.push(new UrlObject(item.url, item.title, item.visitCount)));
        this.notifyAll();
    }

    update() {

        const query = {
            text: "",
            startTime: 0,
            endTime: new Date().getTime(),
            maxResults: 0
        };

        chrome.history.search(query, this.onHistoryResponce)
    }
}

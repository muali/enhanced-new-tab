class URLList extends ListenedData {
    constructor(history) {
        super();

        this.urls = [];
        this.history = history;
        this.update = this.update.bind(this);

        history.addListener(this.update);
        this.update();
    }

    update() {
        this.urls = this.history.urls.splice(0);
        this.urls.sort((a, b) => b.visitCount - a.visitCount);
        this.notifyAll();
    }
}

class FilteredURLList extends ListenedData {
    constructor(urlList, filter) {
        super();

        this.urlList = urlList;
        this.filter = filter;
        this.urls = [];

        this.update = this.update.bind(this);
        urlList.addListener(this.update);
        filter.addListener(this.update);
        this.update();
    }

    update() {
        this.urls = [];

        const limit = getSettings().urlsCount;
        for (const url of this.urlList.urls) {
            if (this.filter.filterUrl(url))
                this.urls.push(url);

            if (this.urls.length == limit)
                break;
        }        

        this.notifyAll();
    }
}

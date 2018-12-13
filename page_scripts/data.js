class UrlObject {
    constructor(url, title, visitCount) {
        this.url = url;
        this.title = title;
        this.visitCount = visitCount;
    }
}

class DomainObject {
    constructor(name, visitCount, urls) {
        this.name = name;
        this.visitCount = visitCount;
        this.urls = urls.slice(0);
        this.urls.sort((a, b) => b.visitCount - a.visitCount);
    }
}
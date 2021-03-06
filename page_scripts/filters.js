class Filter extends ListenedData {
    constructor() {
        super();
        this.makeFilteredDomain = this.makeFilteredDomain.bind(this);
        this.filterDomain = this.filterDomain.bind(this);
        this.filterUrl = this.filterUrl.bind(this);
    }

    // DomainObject => nullable DomainObject
    makeFilteredDomain(domainObject) {
        if (!this.filterDomain(domainObject))
            return null;
        
        const urls = domainObject.urls.filter(url => this.filterUrl(url))
        if (urls.length == 0)
            return null;

        return new DomainObject(domainObject.name, domainObject.visitCount, urls);
    }

    // DomainObject => bool
    filterDomain(domainObject) {
        return true;
    }

    // UrlObject => bool
    filterUrl(urlObject) {
        return true;
    }
}

class MixedFilter extends Filter {
    constructor(filters) {
        super();
        this.filters = filters;
        this.filters.forEach(f => f.addListener(this.notifyAll));
    }

    filterDomain(domainObject) {
        for (const filter of this.filters) {
            if (!filter.filterDomain(domainObject))
                return false;
        }
        return true;
    }

    filterUrl(urlObject) {
        for (const filter of this.filters) {
            if (!filter.filterUrl(urlObject))
                return false;
        }
        return true;
    }

}

class SearchFilter extends Filter {
    constructor() {
        super();
        this.searchQuery = "";
        this.updateSearchQuery = this.updateSearchQuery.bind(this);
    }

    updateSearchQuery(searchQuery) {
        if (searchQuery != this.searchQuery) {
            this.searchQuery = searchQuery;
            this.notifyAll();
        }
    }

    filterUrl(urlObject) {
        return urlObject.url.search(this.searchQuery) != -1;
    }
}
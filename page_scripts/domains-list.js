class DomainsList extends ListenedData {
    constructor(history) {
        super();

        this.history = history;
        this.domains = [];
        this.update = this.update.bind(this);
        this.makeDomainMap = this.makeDomainMap.bind(this);

        history.addListener(this.update);
        this.update();
    }

    update() {
        this.domains = [];

        const domainMap = this.makeDomainMap();

        for (let domainName in domainMap) {

            let visitCount = 0;
            for (let url of domainMap[domainName]) {
                visitCount += url.visitCount;
            }

            this.domains.push(new DomainObject(domainName, visitCount, domainMap[domainName]));
        }

        this.domains.sort((a, b) => b.visitCount - a.visitCount);
        this.notifyAll();
    }

    makeDomainMap() {
        const domains = {};

        for (let urlObj of this.history.urls) {
        
            const domainName = new URL(urlObj.url).host;
            if (!domains.hasOwnProperty(domainName)) {
                domains[domainName] = [];
            }

            domains[domainName].push(urlObj);
        }

        return domains;
    }
}

class FilteredDomainsList extends ListenedData {
    constructor(domainsList, filter) {
        super();

        this.domainsList = domainsList;
        this.filter = filter;
        this.domains = [];
        this.update = this.update.bind(this);

        domainsList.addListener(this.update);
        filter.addListener(this.update);
        this.update();
    }

    update() {
        this.domains = [];

        const urlLimit = getSettings().urlsInDomainCount;
        const domainLimit = getSettings().domainsCount;

        for (const domain of this.domainsList.domains) {
            let filtered = this.filter.makeFilteredDomain(domain);
            if (filtered === null)
                continue;

            if (filtered.urls.length > urlLimit) {
                filtered = new DomainObject(domain.name, domain.visitCount, domain.urls.splice(0, urlLimit));
            }

            this.domains.push(filtered);
            if (this.domains.length == domainLimit)
                break;
        }

        this.notifyAll();
    }
}
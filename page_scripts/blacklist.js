class BlackList extends ListenedData {
    constructor() {
        super();

        this.domainBar = {
            domains: new Set(),
            urls: new Set()
        };

        this.urlBar = {
            domains: new Set(),
            urls: new Set()
        };

        this.onStorageChanged = this.onStorageChanged.bind(this);
        this.add = this.add.bind(this);
        this.updateStored = this.updateStored.bind(this);

        chrome.storage.onChanged.addListener(this.onStorageChanged);

        chrome.storage.local.get("blackList", function(result) {
            if (typeof result.blackList !== "undefined") {
                this.domainBar = result.blackList.domainBar;
                this.urlBar = result.blackList.urlBar;
                this.notifyAll();
            }
        }.bind(this));
    }

    onStorageChanged(changes, storageArea) {
        if (storageArea !== "local") {
            return;
        }

        if (changes["blackList"]) {

            this.domainBar.domains = new Set(changes["blackList"].newValue.domainBar.domains);
            this.domainBar.urls = new Set(changes["blackList"].newValue.domainBar.urls);
            this.urlBar.domains = new Set(changes["blackList"].newValue.urlBar.domains);
            this.urlBar.urls = new Set(changes["blackList"].newValue.urlBar.urls);

            this.notifyAll();
        }
    }

    updateStored() {
        chrome.storage.local.set({
            blackList: {
                domainBar: {
                    domains: Array.from(this.domainBar.domains),
                    urls: Array.from(this.domainBar.urls)
                },
                urlBar: {
                    domains: Array.from(this.urlBar.domains),
                    urls: Array.from(this.urlBar.urls)
                }
            }
        });
    };

    add(byDomain, domainBar, ignoredObject) {
        const blackList = domainBar ? this.domainBar : this.urlBar;
        if (byDomain) {
            blackList.domains.add(ignoredObject);
        }
        else {
            blackList.urls.add(ignoredObject);
        }
        this.updateStored();
    }
}


//TODO: need to be much faster
class BlackListFilter extends Filter {
    constructor(blackList, domainBar) {
        super();

        this.blackList = blackList;
        this.domainBar = domainBar;

        this.getBlackListData = this.getBlackListData.bind(this);

        blackList.addListener(this.notifyAll);
    }

    filterDomain(domainObject) {
        const blackListData = this.getBlackListData();
        return !blackListData.domains.has(domainObject.name);
    }

    filterUrl(urlObject) {
        const blackListData = this.getBlackListData();
        return !blackListData.urls.has(urlObject.url);
    }

    getBlackListData() {
        return this.domainBar ? this.blackList.domainBar : this.blackList.urlBar;
    }
}
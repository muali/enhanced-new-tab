function BlackList() {

    ListenedData.call(this)

    this.domainBar = {
        domains: [],
        urls: []
    };

    this.urlBar = {
        domains: [],
        urls: []
    };

    chrome.storage.onChanged.addListener(function(changes, storageArea) {
        if (storageArea !== "local") {
            return;
        }

        if (changes["blackList"]) {
            this.domainBar = changes["blackList"].newValue.domainBar;
            this.urlBar = changes["blackList"].newValue.urlBar;
            this.onUpdate();
        }
    }.bind(this));

    this.updateStored = function() {
        chrome.storage.local.set({
            blackList: {
                domainBar: this.domainBar,
                urlBar: this.urlBar
            }
        });
    };

    this.add = function(byDomain, domainBar, ignoredObject) {
        var blackList = domainBar ? this.domainBar : this.urlBar;
        if (byDomain) {
            blackList.domains.push(ignoredObject);
        }
        else {
            blackList.urls.push(ignoredObject);
        }
        this.updateStored();
        this.onUpdate();
    };

    chrome.storage.local.get("blackList", function(result) {
        if (typeof result.blackList !== "undefined") {
            this.domainBar = result.blackList.domainBar;
            this.urlBar = result.blackList.urlBar;
            this.onUpdate();
        }
    }.bind(this));

}
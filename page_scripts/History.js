/*
*   response on get description:
*       array of domain
*       domain :
*       {
*           domain: string
*           totalVisits: number,
*           array of url,
*       }
*       url :
*       {
*           url: string
*           visitCount: number,
*           lastVisit: date,
*       }
*   Domain are sorted by visit count, url are sorted by visit count (in domain object)
*   Blacklist is used as filter for both domain and url
*/
function History() {

    ListenedData.call(this);

    var ignored_schemas = ["chrome-extension:", "file:"];

    this.update = function(daysAgo) {

        chrome.history.search(
            {
                text: "",
                startTime: daysAgo? new Date().getTime() - 24 * 3600 * 1000 * daysAgo : 0,
                endTime: new Date().getTime(),
                maxResults: 0
            },
            function(historyItems) {
                this.visits = [];
                for (var i = 0; i < historyItems.length; ++i){
                    if (ignored_schemas.indexOf(new URL(historyItems[i].url).protocol) == -1 && historyItems[i].visitCount) {
                        this.visits.push(historyItems[i]);
                    }
                }
                this.onUpdate();
            }.bind(this)
        );
    };

}

//var History = new function() {
//    var self = this;
//    self.blackList = {
//        DomainBar: {
//            domain: [],
//            url: []
//        },
//        URLBar: {
//            domain: [],
//            url: []
//        }
//    };
//
//    /*
//    *   Pretty user choice later
//    */
//    self.maxDomainCount = 20;
//
//    self.buildDomainList = function(visitsByURL){
//        var domains = [];
//        var blackList = self.blackList.DomainBar;
//        for (var url in visitsByURL) {
//            var domain = new URL(url).host;
//            if (blackList.domain.indexOf(domain) != -1 || blackList.url.indexOf(url) != -1)
//                continue;
//
//            if (!domains[domain]) {
//                domains[domain] = {
//                    totalVisits: 0,
//                    urls: []
//                }
//            }
//
//            domains[domain].urls[url] = visitsByURL[url];
//            domains[domain].totalVisits += visitsByURL[url].visitCount;
//        }
//
//        var domainsList = [];
//
//        for (var domain in domains) {
//
//            var domainObject = {
//                domain: domain,
//                visitCount: domains[domain].totalVisits,
//                urls: []
//            };
//
//            for (var url in domains[domain].urls) {
//                var urlEntry = {
//                    url: url,
//                    visitCount: domains[domain].urls[url].visitCount,
//                    lastVisit: domains[domain].urls[url].lastVisit
//                };
//
//                domainObject.urls.push(urlEntry);
//            }
//
//            domainObject.urls.sort(self.greaterVisit);
//
//            domainObject.urls = domainObject.urls.slice(0, self.maxUrlInDomainEntry);
//
//            domainsList.push(domainObject);
//        }
//
//        domainsList.sort(self.greaterVisit);
//
//        return domainsList;
//    };
//
//    self.buildURLList = function(visitsByURL) {
//
//        var urlList = [];
//        var blackList  = self.blackList.URLBar;
//
//        for (var url in visitsByURL) {
//            var domain = new URL(url).host;
//            if (blackList.domain.indexOf(domain) != -1 || blackList.url.indexOf(url) != -1)
//                continue;
//            urlList.push(visitsByURL[url]);
//        }
//
//        urlList.sort(self.greaterVisit);
//    };
//
//    self.get = function (daysAgo, callback) {
//        HistoryCache.get(daysAgo, function (visitsByURL) {
//            callback({
//                byDomain: self.buildDomainList(visitsByURL),
//                byUrl: self.buildURLList(visitsByURL)
//            });
//        });
//    };
//
//    self.addToBlackList = function(byDomain, domainBar, ignoredObject) {
//        var blackList = domainBar ? self.blackList.DomainBar : self.blackList.URLBar;
//        if (byDomain) {
//            blackList.domain.push(ignoredObject);
//        }
//        else {
//            blackList.url.push(ignoredObject);
//        }
//        chrome.storage.local.set({
//            blackList: self.blackList
//        })
//    }
//
//    // For syncing multiple browser instance
//    chrome.storage.onChanged.addListener(function(changes, storageArea) {
//        if (storageArea !== "locale") {
//            return;
//        }
//
//        if (changes["blackList"]) {
//            self.blackList = changes["blackList"].newValue;
//        }
//    });
//
//    self.greaterVisit = function(a, b) {
//        return b.visitCount - a.visitCount;
//    }
//};

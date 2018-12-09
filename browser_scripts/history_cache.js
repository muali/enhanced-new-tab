Date.prototype.toMidnight = function() {
    var newDate = new Date(this.getTime());
    newDate.setHours(0, 0, 0, 0);
    return newDate.getTime();
};

Date.prototype.oneDay = 3600 * 24 * 1000;


var HistoryCache = new function() {
    const maxRequestedURL = 100000;
    const maxDailyLength = 90;
    var self = this;

    self.countedTransitions = [
        "link",
        "typed",
        "auto_bookmark",
        "manual_subframe",
        "generated"
//      "keyword",
//      "keyword_generated"
    ];

    self.lastUpdate = 0;
    self.daily = {};
    self.total = {};

    self.updateHistoryItem = function(url, startTime, endTime, onUpdate, onVisit) {
        chrome.history.getVisits({url: url}, function (visitItems) {
            for (var i = 0; i < visitItems.length; ++i) {
                if (visitItems[i].visitTime >= startTime && visitItems[i].visitTime < endTime) {
                    onVisit(url, visitItems[i]);
                }
            }
            onUpdate();
        });
    };

    self.getUncached = function(startTime, endTime, onProcessed, onVisit, onEntry) {
        chrome.history.search( {
            text: "",
            startTime: startTime,
            endTime: endTime,
            maxResults: maxRequestedURL
        },  function(historyItems) {

            if (historyItems.length === 0) {
                onProcessed();
                return;
            }

            var countedHistoryItem = 0;
            function onHistoryItemUpdate(){
                ++countedHistoryItem;
                if (countedHistoryItem == historyItems.length)
                    onProcessed();
            }

            for (var i = 0; i < historyItems.length; ++i) {
                var historyItem = historyItems[i];
                onEntry(historyItem);
                self.updateHistoryItem(historyItem.url, startTime, endTime, onHistoryItemUpdate, onVisit);
            }
        });
    };

    self.sync = function(callback) {
        chrome.storage.local.get(["lastUpdate", "total", "daily"], function(storedCache) {
            if (self.lastUpdate < storedCache.lastUpdate) {
                self.lastUpdate = storedCache.lastUpdate;
                self.total = storedCache.total;
                self.daily = storedCache.daily;
            }
            else if (self.lastUpdate > storedCache.lastUpdate || storedCache.lastUpdate == undefined){
                chrome.storage.local.set({
                    lastUpdate: self.lastUpdate,
                    total: self.total,
                    daily: self.daily
                })
            }
            callback();
        });
    };

    self.update = function(callback) {
        self.sync(function() {
            var currentTime = new Date().getTime();
            var midnight    = new Date().toMidnight();
            var firstDay    = new Date(midnight - new Date().oneDay * maxDailyLength).getTime();

            if (midnight > self.lastUpdate) {
                for (var day in self.daily) {
                    if (day < firstDay) {
                        delete self.daily[day];
                    }
                }
            }

            function addHistoryItem (historyItem) {
                if (!self.total[historyItem.url]) {
                    self.total[historyItem.url] = {
                        lastVisit: historyItem.lastVisit,
                        visitCount: 0
                    };
                }
            }

            function addVisit(url, visitItem) {
                if (self.countedTransitions.indexOf(visitItem.transition) == -1) {
                    return;
                }
                if (visitItem.visitTime >= firstDay) {
                    var visitDate = new Date(visitItem.visitTime).toMidnight();

                    if (!self.daily[visitDate]) {
                        self.daily[visitDate] = {};
                    }

                    if (!self.daily[visitDate][url]) {
                        self.daily[visitDate][url] = {
                            visitCount: 0
                        };
                    }

                    ++self.daily[visitDate][url].visitCount;
                }
                ++self.total[url].visitCount;
            }

            function onAllProcessed() {
                for (var url in self.total) {
                    if (self.total[url].visitCount === 0) {
                        delete self.total[url];
                    }
                }
                self.lastUpdate = currentTime;
                self.sync(callback);
            }

            self.getUncached(self.lastUpdate, currentTime, onAllProcessed, addVisit, addHistoryItem);
        });
    };

    self.get = function(daysAgo, callback) {
        if (daysAgo > maxDailyLength) {
            console.log("error: max daily length")
            return;
        }
        if (daysAgo == 0) {
            self.update(function () {
                callback(self.total);
            })
        }
        else {
            self.update(function(){
                var result = {};
                var firstRequestedDay = new Date().toMidnight() - new Date().oneDay * daysAgo;
                for (var day in self.daily) {
                    if (day >= firstRequestedDay) {
                        for (var url in self.daily[day]) {
                            if (!result[url]) {
                                result[url] = {
                                    lastVisit: self.total[url].lastVisit,
                                    visitCount: 0
                                };
                            }

                            result[url].visitCount += self.daily[day][url].visitCount;
                        }
                    }
                }
                callback(result);
            })
        }
    }
};

chrome.runtime.onMessage.addListener(
    //Not obvious - return true if sendResponse called async
    function(request, sender, sendResponse) {
        //TODO: check that sender is our extension
        if (request.type === "history-cache") {
            HistoryCache.get(request.daysAgo, sendResponse)
            return true;
        }
    }
);

//for debug only
function dropCache() {
    HistoryCache.lastUpdate = 0;
    HistoryCache.total = {};
    HistoryCache.daily = {};
    chrome.storage.local.set({lastUpdate: -1});
}
var newTabApp = angular.module('newTab', [/*'ngSanitize', */'ui.bootstrap']);

newTabApp.controller('newTabCtrl', function($scope, $modal) {

    $scope.history = new History();

    $scope.historyPeriod = 0;

    $scope.updateHistory = function(daysAgo) {
        $scope.history.update(daysAgo);
        $scope.historyPeriod = daysAgo;
    };

    $scope.doBookmark = function(url, size) {

        var modalInstance = $modal.open({
            templateUrl: chrome.extension.getURL('html/bookmark_dialog_small.html'),
            controller: 'bookmarksSmallCtrl',
            size: size,
            resolve: {
                url: function () {
                    return url;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.blackList = new BlackList();

    $scope.updateHistory($scope.historyPeriod);

});

//newTabApp.filter('partition', function() {
//
//    var cache = {};
//    var filter = function(arr, size) {
//        if (!arr) {
//            return;
//        }
//
//        var JSONArray = JSON.stringify(arr) + size;
//
//        if (JSONArray in cache)
//            return cache[JSONArray];
//
//        var newArr = [];
//
//        for (var i=0; i<arr.length; i+= size) {
//            newArr.push(arr.slice(i, i + size));
//        }
//
//        cache[JSONArray] = newArr;
//
//        return newArr;
//    };
//
//    return filter;
//});


//var messageHandler = new MessageHandler($scope);
//
//
//$scope.onHistoryUpdate = function(updatedHistory) {
//    if ($scope.historyPeriod === updatedHistory.period) {
//
//        var domainList = updatedHistory.content.byDomain;
//        var urlList = updatedHistory.content.byUrl;
//
//        for (var i = 0; i < domainList.length; ++i) {
//            updatedHistory.content.showDetails = false;
//        }
//
//        $scope.$apply(function(){
//            $scope.domainList = domainList;
//            $scope.urlList = urlList;
//        });
//    }
//};
//
//$scope.update = function() {
//    messageHandler.postMessage({
//        type: "historyRequest",
//        period: $scope.historyPeriod
//    });
//};
//
//$scope.updateHistory = function(historyPeriod) {
//    $scope.historyPeriod = historyPeriod;
//    $scope.update()
//};
//
//$scope.updateHistory(0);
//
//$scope.addDomainToBlackList = function(domain){
//    messageHandler.postMessage({
//        type: "addToBlackList",
//        byDomain: true,
//        domainBar: true,
//        ignoredObject: domain
//    })
//};
//
//$scope.addURLToBlacklist = function(url){
//    messageHandler.postMessage({
//        type: "addToBlackList",
//        byDomain: false,
//        domainBar: true,
//        ignoredObject: url
//    })
//};
//
//$scope.addToBookmark = function(s){};
//
//$scope.domainToURL = function(domain) {
//    return "http://" + domain;
//};
//
//$scope.domainToShort = function(domain) {
//    var c = domain;
//    var pos = domain.lastIndexOf('.');
//    if (pos != -1) {
//        domain = domain.substr(0, pos);
//    }
//
//    //exclude www section
//    if (domain.substr(0, 4) === "www.") {
//        domain = domain.substr(4);
//    }
//
//    domain.toLowerCase();
//    domain = domain[0].toUpperCase() + domain.slice(1);
//    return domain;
//}
//
//function MessageHandler($scope) {
//    var self = this;
//    var port = chrome.runtime.connect();
//
//    port.onMessage.addListener(function(msg) {
//        switch (msg.type) {
//            case "historyResponse":
//                $scope.onHistoryUpdate(msg.updated);
//                break;
//            case "updateRequest":
//                $scope.update()
//        }
//    });
//
//    self.postMessage = function(msg) {
//        port.postMessage(msg);
//    };
//}


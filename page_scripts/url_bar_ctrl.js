function URLList(history, blackList) {

    ListenedData.call(this);

    this.data = [];

    this.update = function() {
        var blockedDomains = blackList.urlBar.domains;
        var blockedURLs = blackList.urlBar.urls;

        this.data = [];

        for (var i = 0; i < history.visits.length; ++i) {
            var url = history.visits[i].url;
            var domain = new URL(url).host;

            if (blockedDomains.indexOf(domain) != -1 || blockedURLs.indexOf(url) != -1)
                continue;

            this.data.push(history.visits[i]);
        }

        this.data.sort(function(urlA, urlB){
            return urlB.visitCount - urlA.visitCount;
        });

        this.onUpdate();
    };

    history.addListener(this.update.bind(this));

    blackList.addListener(this.update.bind(this));

}


newTabApp.controller('urlBarCtrl', function($scope, $sce) {

    $scope.urlList = new URLList($scope.history, $scope.blackList);

    $scope.urlList.addListener(function(){
        $scope.$apply();
    });


    $scope.addToBlackList = function(url) {
        $scope.blackList.add(false, false, url);
    };

    $scope.shortURL = function(url) {
        var schema_len = new URL(url).protocol.length + 2;
        var result = url.substr(schema_len);
        if (result.substr(0, 4) == "www.") {
            result = result.substr(4);
        }
        return shortString(result);
    };

    $scope.shortString = shortString;

});
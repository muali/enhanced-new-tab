newTabApp.controller('urlBarCtrl', function($scope, $sce) {

    const urlList = new URLList($scope.history);

    const blackListFilter = new BlackListFilter($scope.blackList, false);
    $scope.filter = new MixedFilter([blackListFilter, $scope.searchFilter]);

    $scope.filteredURLList = new FilteredURLList(urlList, $scope.filter);

    $scope.filteredURLList.addListener(function(){
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
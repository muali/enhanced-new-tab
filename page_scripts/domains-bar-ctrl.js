newTabApp.controller('domainsBarCtrl', function($scope, $sce) {

    const domainsList = new DomainsList($scope.history);
    
    $scope.filter = new BlackListFilter($scope.blackList, true);
    $scope.filteredDomainsList = new FilteredDomainsList(domainsList, $scope.filter);

    $scope.filteredDomainsList.addListener(function(){
        $scope.$apply();
    });

    $scope.domainToURL = function(domain) {
        return "http://" + domain;
    };

    $scope.domainToShort = function(domain) {
        //exclude www section
        if (domain.substr(0, 4) === "www.") {
            domain = domain.substr(4);
        }

        domain.toLowerCase();
        domain = domain[0].toUpperCase() + domain.slice(1);
        return domain;
    };

    $scope.addDomainToBlackList = function(domain) {
        $scope.blackList.add(true, true, domain);
    };

    $scope.addURLToBlackList = function(url) {
        $scope.blackList.add(false, true, url);
    };


    $scope.shortString = shortString;


});
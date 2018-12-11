function DomainsList(history, blackList) {

    ListenedData.call(this);

    this.data = [];

    this.update = function() {
        var domains = [];

        var blockedDomains = blackList.domainBar.domains;
        var blockedURLs = blackList.domainBar.urls;

        for (var i = 0; i < history.visits.length; ++i) {
            var url = history.visits[i].url;
            var domain = new URL(url).host;

            if (blockedDomains.indexOf(domain) != -1 || blockedURLs.indexOf(url) != -1)
                continue;

            if (!domains[domain]) {
                domains[domain] = {
                    totalVisits: 0,
                    urls: []
                }
            }

            domains[domain].urls[url] = history.visits[i];
            domains[domain].totalVisits += history.visits[i].visitCount;
        }

        this.data = [];

        for (var domain in domains) {

            var domainObject = {
                name: domain,
                visitCount: domains[domain].totalVisits,
                urls: []
            };

            for (var url in domains[domain].urls) {
                var urlEntry = {
                    url: url,
                    visitCount: domains[domain].urls[url].visitCount,
                    lastVisit: domains[domain].urls[url].lastVisit
                };

                domainObject.urls.push(urlEntry);
            }

            domainObject.urls.sort(self.greaterVisit);

            domainObject.urls = domainObject.urls.slice(0, self.maxUrlInDomainEntry);

            this.data.push(domainObject);
        }

        this.data.sort(function(domainA, domainB){
            return domainB.visitCount - domainA.visitCount;
        });

        this.onUpdate();
    };

    history.addListener(this.update.bind(this));

    blackList.addListener(this.update.bind(this));

}

newTabApp.controller('domainsBarCtrl', function($scope, $sce) {

    $scope.domainsList = new DomainsList($scope.history, $scope.blackList);

    $scope.expandedDomains = [];

    $scope.domainsList.addListener(function(){
        for (var domain in $scope.domainsList.data) {
            if (!domain.name in $scope.expandedDomains) {
                $scope.expandedDomains[domain.name] = false;
            }
        }
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
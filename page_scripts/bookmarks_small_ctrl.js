newTabApp.controller('bookmarksSmallCtrl', function($scope, $modalInstance, url, title) {

    $scope.folders = [];

    $scope.selectedFolder = null;

    var add_on_update = false;

    $scope.updateFolders = function() {
        getBookmarkFolders(function(folders){
            $scope.$apply($scope.folders = folders);
            //at least one folders always exists
            $scope.selectedFolder = $scope.folders[0];
            if (add_on_update) {
                add_on_update = false;
                addBookmark($scope.url, $scope.title, $scope.selectedFolder);
            }
        });
    };

    chrome.bookmarks.search({url: url}, function(matched_nodes) {
        if (matched_nodes.length === 0) {
            if ($scope.selectedFolder === null)
                add_on_update = true;
            else
                addBookmark($scope.url, $scope.title, $scope.selectedFolder);
        }
    })

});
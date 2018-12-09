function Bookmarks($modal) {

    ListenedData.call(this);

    this.exists = function(url) {

    };

    this.add = function(url) {

    };

    this.addToPath = function(url, path) {

    };

    this.addFolder = function(name) {

    };

    this.addFolderToPath = function(name, path) {

    };
}

/*
*  build bookmark tree
*  reason: build-in function is async and didn't provide method to retrieve all nodes in single query
*/
function getBookmarkTree(callback) {
    var root = {};

    var opened_nodes = 0;

    function traverse(parent) {

        ++opened_nodes;

        chrome.bookmarks.getChildren(parent.id, function(childs) {
            for (var i = 0; i < childs.length; ++i) {
                var child_node = childs[i];
                child_node.childs = [];
                parent.childs.push(child_node);
                traverse(child_node);
            }
            --opened_nodes;

            if (opened_nodes === 0) {
                callback(root);
            }
        });
    }

    chrome.bookmarks.getTree(function(node) {
        root = node;
        root.childs = [];
        traverse(root);
    });
}

/*
* build array of bookmark tree nodes
* nodes is sorted in reverse of depth-first search order
*/
function getBookmarkItems(callback) {
    getBookmarkTree(function(root) {
        var items = [];
        function traverse(node) {
            for (var i = 0; i < node.childs.length; ++i) {
                traverse(node.childs[i]);
            }
            items.push(node);
        }
        traverse(root);
        callback();
    });
}

/*
*   build array of all bookmark folders
*   sorted by last modification date
*   exclude root node
*/
function getBookmarkFolders(callback) {
    getBookmarkItems(function(bookmark_nodes) {
        var folders = [];

        for (var i = 0; i < bookmark_nodes; ++i) {
            if (bookmark_nodes[i].url === undefined && bookmark_nodes[i].parentId !== undefined)
                folders.push(bookmark_nodes[i]);
        }

        folders.sort(function(folderA, folderB) {
            if (folderB.dateGroupModified === undefined) {
                if (folderA.dateGroupModified === undefined)
                    return 0;
                return -1;
            }
            return folderB.dateGroupModified - folderA.dateGroupModified;
        });

        callback(folders);
    });
}

function openBookmarksDialog($modal) {
    var instance = $modal.open({
            templateUrl: "bookmark_dialog_small.html",
            controller: "bookmarksSmallCtrl"
        }
    );
    instance.then(function(){}, function(){});
}
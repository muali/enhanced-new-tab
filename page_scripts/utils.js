function shortString(url, max_len) {
    if (max_len === undefined) {
        max_len = 50;
    }
    var result = url;
    if (url.length > max_len) {
        result = url.substr(0, max_len - 3) + "..."
    }
    return result;
}
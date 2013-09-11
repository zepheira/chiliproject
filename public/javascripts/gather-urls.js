var Gatherer = {
    "scr": null,
    "cache": null,
    "service": "https://who-intermediary.zepheira.com/bookmarks/children_urls?callback=Gatherer.fill&issue="
};

Gatherer.get = function() {
    var issue;
    issue = document.location.pathname.substr(8);
    Gatherer.scr = document.createElement("script");
    Gatherer.scr.type = "text/javascript";
    Gatherer.scr.src = Gatherer.service + issue + "&bust=" + new Date().valueOf();
    document.getElementsByTagName("head")[0].appendChild(Gatherer.scr);
};

Gatherer.fill = function(data) {
    var i, str, dest;
    str = "";
    for (i = 0; i < data.length; i++) {
        str += data[i] + "\n";
    }
    dest = document.getElementsById("custom_message");
    dest.value = dest.value + str;
    if (Gatherer.cache === null) {
        Gatherer.cache = data;
    }
    Gatherer.scr.parentNode.removeChild(Gatherer.scr);
};

Gatherer.start = function() {
    if (Gatherer.cache === null) {
        Gatherer.get();
    } else {
        Gatherer.fill(Gatherer.cache);
    }
};

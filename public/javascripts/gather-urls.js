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
    str = "<ul>\n";
    for (i = 0; i < data.length; i++) {
        str += '<li><a href="' + data[i].uri + '">' + data[i].subject + "</a></li>\n";
    }
    str += "</ul>\n";
    dest = document.getElementById("custom_message");
    dest.value = dest.value + str;
    if (Gatherer.cache === null) {
        Gatherer.cache = data;
    }
    if (Gatherer.scr !== null) {
        Gatherer.scr.parentNode.removeChild(Gatherer.scr);
        Gatherer.scr = null;
    }
};

Gatherer.start = function() {
    if (Gatherer.cache === null) {
        Gatherer.get();
    } else {
        Gatherer.fill(Gatherer.cache);
    }
};

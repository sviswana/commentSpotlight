$(document).ready(function() {
    var mainTab;

    $("#overall").on('click', 'a', function() {

        var currentURL = mainTab.url;

        //need to reset URl if a timestamp has already been clicked
        if (currentURL.indexOf('#') != -1) {
            currentURL = currentURL.substring(0, currentURL.indexOf('#'));
        }
        var timest = this.id;
        var newURL = currentURL + '#t=';

        //hour timestamp
        if (timest.replace(/[^:]/g, "").length == 2) {
            timest = timest.replace(":", "h");
        }
        //minutes timestamp
        timest = timest.replace(":", "m");
        timest = timest + 's';

        updateUrl(mainTab, newURL + timest);

        return;
    });

    function updateUrl(tab, newurl) {
        chrome.tabs.update(tab.id, {
            url: newurl
        });
    }

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
       
        chrome.tabs.sendMessage(
            tabs[0].id, {
                from: 'popup',
                subject: 'DOMInfo'
            },

            function(setDOMInfo) {
                mainTab = tabs[0];
                var list = document.getElementById('overall');
                
                //get all comments from content script
                for (var j = 0; j < setDOMInfo.length; j++) {

                    var m;
                    var sentComment = setDOMInfo[j];
                    var entry = document.createElement('ul');
                    entry.className = "menu-entry";

                    //This is to ensure we get each match (if there are multiple timestamps in one comment)
                    var matches = sentComment.match(/<a.*?<\/a>/g); 
                   
                    var len = matches.length;

                    for (var i = 0; i < len; i++) {
                        var list = document.getElementById('overall');                        
                        var link = matches[i];
                        var endBracket = link.indexOf('>');
                        var midPart = link.substring(endBracket + 1);
                        var lastPart = midPart.indexOf('<');
                        var timeVal = midPart.substring(0, lastPart);

                        //replace each of the comments in the popup with the timestamp
                        sentComment = sentComment.replace(matches[i], '<a id="' + timeVal + '" href=#>' + timeVal + '</a>');
                        
                    }
                    entry.innerHTML = sentComment;
                    list.appendChild(entry);                    
                }

            });
    });

});
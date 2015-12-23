
var previousURL=" ";

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {      
       //Only display icon if valid youtube video. 
       var patt = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
       if (patt.test(tab.url)) {
        if (previousURL != tab.url && tab.url.indexOf(previousURL) == -1) {
          
        //We need this executeScript line since youtube doesn't reload page when new video is clicked.
         chrome.tabs.executeScript(tabId,{file: 'findComments.js'}, function(response){          
         });
         previousURL = tab.url;         
       }
        chrome.pageAction.show(tabId);
         
    }
});



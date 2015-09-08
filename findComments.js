var listOfComments = [];
var APIKey = 'INSERT_API_KEY_HERE'

function getComments() {
    var checkRegex = /\d{1,2}:\d{2}|\d{1,2}:\d{1,2}:\d{2}/; //this is to check if there is a valid timeStamp in the comment
    var patt = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var currentURL = window.location.href;
    
    //check if url contains a valid Youtube video ID
    var match = currentURL.match(patt);
    
    if (match && match[7].length == 11) {
        var videoID = match[7];
        $.ajax({

            url: 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=' + videoID + '&key='+APIKey+'&maxResults=100',
            dataType: "json",
            async: false,
            success: function(data) {
                var results = data["pageInfo"]["resultsPerPage"];
                for (var j = 0; j < results; j++) {
                    var snippet = data["items"][j]["snippet"];
                   
                    //comments are stored inside snippets
                    if (snippet) {
                        comment = snippet["topLevelComment"]["snippet"]["textDisplay"];
                        //check if comment contains a valid timestamp.
                        if (comment.indexOf("t=") != -1 && comment.indexOf("</a>") != -1 && checkRegex.test(comment)) {
                            listOfComments.push(comment);
                        }
                        
                    }
                }
            }
        });

    }
}
getComments();

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        var l = listOfComments.length;  
        response(listOfComments);
    }

});

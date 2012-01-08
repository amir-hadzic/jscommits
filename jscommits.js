if (!String.prototype.format) {
    String.prototype.format = function() {
        var formatted = this;
        for(arg in arguments) {
            var r = new RegExp("\\{" + arg + "\\}", "g");
            formatted = formatted.replace(r, arguments[arg]);
        }
        return formatted;
    };
}

(function (globals) {    
    var jscommits = globals.jscommits = {},

    MESSAGE_LENGTH = 80,

    AUTHOR_LENGTH = 20,

    AUTHOR_FORMAT = "<a href='https://www.github.com/{0}'>{1}</a>",

    MESSAGE_FORMAT = "<a href='https://www.github.com/{0}/{1}/commit/{2}'>{3}</a>",

    HEADING_FORMAT = "Latest commits for <a href='https://www.github.com/{0}/{1}'>{1}</a> repository.",

    getCommitMessage = function(commit) {
        var message = commit.message;
        var firstSentencePos = message.indexOf("\n");
        
        if (firstSentencePos <  0 || firstSentencePos === 0) {
            firstSentencePos = MESSAGE_LENGTH;
        }

        message = message.substr(0, 
            Math.min(MESSAGE_LENGTH, message.length, firstSentencePos));
        
        return message;
    },
    
    getAuthor = function(commit) {
        var username = commit.author.login;
        
        return username.substr(0, Math.min(AUTHOR_LENGTH, username.length));
    };

    jscommits.showCommits = function(user, repo, element) {
        var heading = document.createElement("div");
        var commits = document.createElement("div");
        heading.className = "jscommits-heading";
        element.className += " jscommits-panel";
        
        heading.innerHTML = HEADING_FORMAT.format(user, repo);

        element.appendChild(heading);
        element.appendChild(commits);

        gh.commit.forBranch(user, repo, "master", function(data){
            var length = data.commits.length > 5 ? 5 : data.commits.length;
            var flip = false;

            for (var i = 0; i < length; i++) {
                var commit = data.commits[i];
                var commitPanel = document.createElement("div");
                var commitMessage = document.createElement("span");
                var commitAuthor = document.createElement("span");
                
                commitPanel.className = flip ? "jscommits-commit flip-color" : "jscommits-commit";
                commitMessage.className = "jscommits-message";
                commitAuthor.className = "jscommits-author";
                
                commitMessage.innerHTML = MESSAGE_FORMAT.format(commit.author.login,
                    repo, commit.id, getCommitMessage(commit));

                commitAuthor.innerHTML = AUTHOR_FORMAT.format(commit.author.login, getAuthor(commit)); 

                commitPanel.appendChild(commitAuthor);
                commitPanel.appendChild(commitMessage);
                commits.appendChild(commitPanel);
                flip = !flip;
            }
        }); 
    };   
}(window));

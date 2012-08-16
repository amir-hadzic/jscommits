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
    GITHUB = "https://www.github.com",
    HEADING_FORMAT = "Latest commits for <a href='https://www.github.com/{0}/{1}'>{1}</a> repository.",

    getUrl = function(parts) {
        var url = GITHUB;

        for (var i = 0; i < arguments.length; i++) {
            url += "/" + arguments[i];
        }

        return url;
    },

    getCommitMessage = function(commit) {
        var message = commit.commit.message;
        var firstSentencePos = message.indexOf("\n");
        
        if (firstSentencePos <  0 || firstSentencePos === 0) {
            firstSentencePos = MESSAGE_LENGTH;
        }

        message = message.substr(0, Math.min(MESSAGE_LENGTH, message.length, firstSentencePos));
        return message;
    },
    
    getAuthorLogin = function(commit) {
        if (commit.committer && commit.committer.login) {
            return commit.committer.login;
        } else if (commit.author && commit.author.login) {
            return commit.author.login;
        }

        return null;
    },

    getAuthorShortName = function(commit) {
        var username = getAuthorLogin(commit);

        if (!username) {
            var commit = commit.commit;

            if (commit.author && commit.author.email) {
                username = commit.author.email;
            } else if (commit.committer && commit.committer.email) {
                username = commit.committer.email;
            }
        }

        return username.substr(0, Math.min(AUTHOR_LENGTH, username.length));
    },
    
    getMessageElem = function(user, repo, commit) {
        var a = document.createElement("a");
        a.innerHTML = getCommitMessage(commit); 
        a.href = getUrl(user, repo, "commit", commit.sha);
        
        var el = document.createElement("span");
        el.className = "jscommits-message";
        el.appendChild(a);

        return el;
    },

    getAuthorElem = function(commit) {
        var login = getAuthorLogin(commit); 
        var a = document.createElement("a");
        a.innerHTML = getAuthorShortName(commit); 
        
        if (login) {
            a.href = getUrl(login); 
        } else {
            a.href = "#";
        }
        
        var el = document.createElement("span");
        el.className = "jscommits-author";
        el.appendChild(a);
        return el;
    };

    jscommits.showCommits = function(user, repo, element) {
        var heading = document.createElement("div");
        heading.innerHTML = HEADING_FORMAT.format(user, repo);
        heading.className = "jscommits-heading";
        
        var commits = document.createElement("div");
        Gh3.Helper.callHttpApi({
            service : "repos/" + user + "/" + repo + "/commits",
            success : function(res) {
                var length = res.data.length > 15 ? 15 : res.data.length;
                var flip = false;

                for (var i = 0; i < length; i++) {
                    var commit = res.data[i];
                    var commitPanel = document.createElement("div");
                    var commitMessage = getMessageElem(user, repo, commit); 
                    var commitAuthor = getAuthorElem(commit); 

                    commitPanel.className = flip ? "jscommits-commit flip-color" : "jscommits-commit";
                    commitPanel.appendChild(commitAuthor);
                    commitPanel.appendChild(commitMessage);
                    commits.appendChild(commitPanel);
                    flip = !flip;
                }
            }
        });
    
        element.className += " jscommits-panel";
        element.appendChild(heading);
        element.appendChild(commits);
    };   
}(window));

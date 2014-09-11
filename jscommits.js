/* globals document, Gh3 */

(function () {
  "use strict";
  if (!String.prototype.format) {
    String.prototype.format = function () {
      var arg, regex, formatted = this;
      for (arg in arguments) {
        if (arguments.hasOwnProperty(arg)) {
          regex = new RegExp("\\{" + arg + "\\}", "g");
          formatted = formatted.replace(regex, arguments[arg]);
        }
      }
      return formatted;
    };
  }
})();

(function (globals) {
  "use strict";
  var jscommits = globals.jscommits = {},

    GITHUB = "https://www.github.com",
    HEADING_FORMAT = "Latest commits for <a href='https://www.github.com/{0}/{1}'>{1}</a> repository.",

    getUrl = function () {
      var i, url = GITHUB;

      for (i = 0; i < arguments.length; i++) {
        url += "/" + arguments[i];
      }

      return url;
    },

    getCommitMessage = function (commit) {
      var message = commit.commit.message,
        firstSentencePos = message.indexOf("\n");

      if (firstSentencePos <  0 || firstSentencePos === 0) {
        firstSentencePos = message.length;
      }

      message = message.substr(0, firstSentencePos);
      return message;
    },
      
    getAuthorLogin = function (commit) {
      if (commit.committer && commit.committer.login) {
        return commit.committer.login;
      } else if (commit.author && commit.author.login) {
        return commit.author.login;
      }

      return null;
    },

    getAuthorShortName = function (commit) {
      var username = getAuthorLogin(commit);

      if (!username) {
        commit = commit.commit;

        if (commit.author && commit.author.email) {
          username = commit.author.email;
        } else if (commit.committer && commit.committer.email) {
          username = commit.committer.email;
        }
      }

      return username;
    },
    
    getMessageElem = function (user, repo, commit) {
      var el, a = document.createElement("a");
      a.innerHTML = getCommitMessage(commit);
      a.href = getUrl(user, repo, "commit", commit.sha);

      el = document.createElement("span");
      el.className = "jscommits-message";
      el.appendChild(a);

      return el;
    },

    getAuthorElem = function (commit) {
      var el = document.createElement("span"),
        a = document.createElement("a"),
        login = getAuthorLogin(commit);

      if (login) {
        a.href = getUrl(login);
      } else {
        a.href = "#";
      }

      a.innerHTML = getAuthorShortName(commit);
      el.className = "jscommits-author";
      el.appendChild(a);
      return el;
    };

  jscommits.showCommits = function (user, repo, element) {
    var commits = document.createElement("div"),
      heading = document.createElement("div");

    Gh3.Helper.callHttpApi({
      service : "repos/" + user + "/" + repo + "/commits",
      success : function (res) {
        var i, flip = false, length = res.data.length > 15 ? 15 : res.data.length,
          commit, commitPanel, commitMessage, commitAuthor;

        for (i = 0; i < length; i++) {
          commit = res.data[i];
          commitMessage = getMessageElem(user, repo, commit);
          commitAuthor = getAuthorElem(commit);

          commitPanel = document.createElement("div");
          commitPanel.className = flip ? "jscommits-commit flip-color" : "jscommits-commit";
          commitPanel.appendChild(commitAuthor);
          commitPanel.appendChild(commitMessage);

          commits.appendChild(commitPanel);
          flip = !flip;
        }
      }
    });

    heading.innerHTML = HEADING_FORMAT.format(user, repo);
    heading.className = "jscommits-heading";

    element.className += " jscommits-panel";
    element.appendChild(heading);
    element.appendChild(commits);
  };
}(window));

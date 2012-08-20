(function(){var c,f,j;c="undefined"!==typeof exports?exports:this.Gh3={};c.VERSION="0.0.7";f=function(){};f.inherits=function(a,b,d){var e,c=function(){},f=function(a,b){for(var d in b)a[d]=b[d]};e=b&&b.hasOwnProperty("constructor")?b.constructor:function(){a.apply(this,arguments)};f(e,a);c.prototype=a.prototype;e.prototype=new c;b&&f(e.prototype,b);d&&f(e,d);e.prototype.constructor=e;e.__super__=a.prototype;return e};f.extend=function(a,b){var d=f.inherits(this,a,b);d.extend=this.extend;return d};
j={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decode:function(a){for(var b="",d,e,c,f,q,l=0,a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");l<a.length;)d=this._keyStr.indexOf(a.charAt(l++)),e=this._keyStr.indexOf(a.charAt(l++)),f=this._keyStr.indexOf(a.charAt(l++)),q=this._keyStr.indexOf(a.charAt(l++)),d=d<<2|e>>4,e=(e&15)<<4|f>>2,c=(f&3)<<6|q,b+=String.fromCharCode(d),64!=f&&(b+=String.fromCharCode(e)),64!=q&&(b+=String.fromCharCode(c));return b=j._utf8_decode(b)},_utf8_decode:function(a){for(var b=
"",d=0,e=c1=c2=0;d<a.length;)e=a.charCodeAt(d),128>e?(b+=String.fromCharCode(e),d++):191<e&&224>e?(c2=a.charCodeAt(d+1),b+=String.fromCharCode((e&31)<<6|c2&63),d+=2):(c2=a.charCodeAt(d+1),c3=a.charCodeAt(d+2),b+=String.fromCharCode((e&15)<<12|(c2&63)<<6|c3&63),d+=3);return b}};c.Helper=f.extend({},{protocol:"https",domain:"api.github.com",callHttpApi:function(a){a.url=c.Helper.protocol+"://"+c.Helper.domain+"/"+a.service;a.dataType="jsonp";$.ajax(a)}});c.Users=f.extend({},{users:[],search:function(a,
b,d){c.Users.users=[];c.Helper.callHttpApi({service:"legacy/user/search/"+a,data:b,success:function(a){_.each(a.data.users,function(a){c.Users.users.push(new c.User(a.login,a))});d&&d(null,c.Users)},error:function(a){d&&d(Error(a))}})},reverse:function(){c.Users.users.reverse()},sort:function(a){a?c.Users.users.sort(a):c.Users.users.sort()},getAll:function(){return c.Users.users},getByName:function(a){return _.find(c.Users.users,function(b){return b.name==a})},each:function(a){_.each(c.Users.users,
function(b){a(b)})},filter:function(a){return _.filter(c.Users.users,a)}});c.User=f.extend({constructor:function(a,b){if(b)for(var d in b)this[d]=b[d];if(a)this.login=a;else throw"login !";},fetch:function(a){var b=this;c.Helper.callHttpApi({service:"users/"+b.login,success:function(d){for(var e in d.data)b[e]=d.data[e];a&&a(null,b)},error:function(b){a&&a(Error(b))}})}},{});c.GistComment=f.extend({constructor:function(a){for(var b in a)this[b]=a[b]}},{});c.Gist=f.extend({constructor:function(a){for(var b in a)this[b]=
a[b]},fetchContents:function(a){var b=this;b.files=[];c.Helper.callHttpApi({service:"gists/"+b.id,success:function(d){for(var e in d.data.files)b.files.push(d.data.files[e]);delete d.data.files;for(var c in d.data)b[c]=d.data[c];a&&a(null,b)},error:function(b){a&&a(Error(b))}})},fetchComments:function(a){var b=this;b.comments=[];c.Helper.callHttpApi({service:"gists/"+b.id+"/comments",success:function(d){_.each(d.data,function(a){b.comments.push(new c.GistComment(a))});a&&a(null,b)},error:function(b){a&&
a(Error(b))}})},getFileByName:function(a){return _.find(this.files,function(b){return b.filename==a})},getFiles:function(){return this.files},eachFile:function(a){_.each(this.files,function(b){a(b)})},getComments:function(){return this.comments},eachComment:function(a){_.each(this.comments,function(b){a(b)})},filterComments:function(a){return _.filter(this.comments,a)}},{});c.Gists=f.extend({constructor:function(a){if(a)this.user=a;this.gists=[]},fetch:function(a,b,d){var e=this;c.Helper.callHttpApi({service:"users/"+
e.user.login+"/gists",data:a,beforeSend:function(a){a.setRequestHeader("rel",b)},success:function(a){_.each(a.data,function(a){e.gists.push(new c.Gist(a))});d&&d(null,e)},error:function(a){d&&d(Error(a))}})},getGists:function(){return this.gists},eachGist:function(a){_.each(this.gists,function(b){a(b)})},filter:function(a){return _.filter(this.gists,a)}},{});c.Commit=f.extend({constructor:function(a){this.author=a.author;this.author.email=a.commit.author.email;this.author.name=a.commit.author.name;
this.date=a.commit.author.date;this.message=a.commit.message;this.sha=a.sha;this.url=a.url}},{});c.ItemContent=f.extend({constructor:function(a,b,d,c){for(var f in a)this[f]=a[f];if(b)this.user=b;if(d)this.repositoryName=d;if(c)this.branchName=c}},{});c.File=c.ItemContent.extend({constructor:function(a,b,d,e){c.File.__super__.constructor.call(this,a,b,d,e)},fetchContent:function(a){var b=this;c.Helper.callHttpApi({service:"repos/"+b.user.login+"/"+b.repositoryName+"/contents/"+b.path,success:function(d){b.content=
d.data.content;b.rawContent=j.decode(d.data.content);a&&a(null,b)},error:function(b){a&&a(Error(b))}})},fetchCommits:function(a){var b=this;b.commits=[];c.Helper.callHttpApi({service:"repos/"+b.user.login+"/"+b.repositoryName+"/commits",data:{path:b.path},success:function(d){_.each(d.data,function(a){b.commits.push(new c.Commit(a))});a&&a(null,b)},error:function(b){a&&a(Error(b))}})},getRawContent:function(){return this.rawContent},getCommits:function(){return this.commits},getLastCommit:function(){return this.commits[0]},
getFirstCommit:function(){return this.commits[this.commits.length-1]},eachCommit:function(a){_.each(this.commits,function(b){a(b)})},filterCommits:function(a){return _.filter(this.commits,a)},reverseCommits:function(){this.commits.reverse()},sortCommits:function(a){a?this.commits.sort(a):this.commits.sort()}},{});c.Dir=c.ItemContent.extend({constructor:function(a,b,d,e){c.Dir.__super__.constructor.call(this,a,b,d,e)},fetchContents:function(a){var b=this;b.contents=[];c.Helper.callHttpApi({service:"repos/"+
b.user.login+"/"+b.repositoryName+"/contents/"+b.path,data:{ref:b.branchName},success:function(d){_.each(d.data,function(a){"file"==a.type&&b.contents.push(new c.File(a,b.user,b.repositoryName,b.branchName));"dir"==a.type&&b.contents.push(new c.Dir(a,b.user,b.repositoryName,b.branchName))});a&&a(null,b)},error:function(b){a&&a(Error(b))}})},reverseContents:function(){this.contents.reverse()},sortContents:function(a){a?this.contents.sort(a):this.contents.sort()},getContents:function(){return this.contents},
getFileByName:function(a){return _.find(this.contents,function(b){return b.name==a&&"file"==b.type})},getDirByName:function(a){return _.find(this.contents,function(b){return b.name==a&&"dir"==b.type})},eachContent:function(a){_.each(this.contents,function(b){a(b)})},filterContents:function(a){return _.filter(this.contents,a)}},{});c.Branch=f.extend({constructor:function(a,b,d,c,f){if(a)this.name=a;if(b)this.sha=b;if(d)this.url=d;if(c)this.user=c;if(f)this.repositoryName=f},fetchContents:function(a){var b=
this;b.contents=[];c.Helper.callHttpApi({service:"repos/"+b.user.login+"/"+b.repositoryName+"/contents/",data:{ref:b.name},success:function(d){_.each(d.data,function(a){"file"==a.type&&b.contents.push(new c.File(a,b.user,b.repositoryName,b.name));"dir"==a.type&&b.contents.push(new c.Dir(a,b.user,b.repositoryName,b.name))});a&&a(null,b)},error:function(b){a&&a(Error(b))}})},reverseContents:function(){this.contents.reverse()},sortContents:function(a){a?this.contents.sort(a):this.contents.sort()},getContents:function(){return this.contents},
getFileByName:function(a){return _.find(this.contents,function(b){return b.name==a&&"file"==b.type})},getDirByName:function(a){return _.find(this.contents,function(b){return b.name==a&&"dir"==b.type})},eachContent:function(a){_.each(this.contents,function(b){a(b)})},filterContents:function(a){return _.filter(this.contents,a)}},{});c.Repository=f.extend({constructor:function(a,b,d){if(d)for(var c in d)this[c]=d[c];if(a)this.name=a;if(b)this.user=b},fetch:function(a){var b=this;c.Helper.callHttpApi({service:"repos/"+
b.user.login+"/"+b.name,success:function(d){for(var c in d.data)b[c]=d.data[c];a&&a(null,b)},error:function(b){a&&a(Error(b))}})},fetchBranches:function(a){var b=this;b.branches=[];c.Helper.callHttpApi({service:"repos/"+b.user.login+"/"+b.name+"/branches",success:function(d){_.each(d.data,function(a){b.branches.push(new c.Branch(a.name,a.commit.sha,a.commit.url,b.user,b.name))});a&&a(null,b)},error:function(b){a&&a(Error(b))}})},getBranches:function(){return this.branches},getBranchByName:function(a){return _.find(this.branches,
function(b){return b.name==a})},eachBranch:function(a){_.each(this.branches,function(b){a(b)})},reverseBranches:function(){this.branches.reverse()},sortBranches:function(a){a?this.branches.sort(a):this.branches.sort()}},{});c.Repositories=f.extend({constructor:function(a){if(a)this.user=a},fetch:function(a,b,d){var e=this;e.repositories=[];c.Helper.callHttpApi({service:"users/"+e.user.login+"/repos",data:a,beforeSend:function(a){a.setRequestHeader("rel",b)},success:function(a){_.each(a.data,function(a){e.repositories.push(new c.Repository(a.name,
e.user))});d&&d(null,e)},error:function(a){d&&d(Error(a))}})},reverseRepositories:function(){this.repositories.reverse()},sortRepositories:function(a){a?this.repositories.sort(a):this.repositories.sort()},getRepositories:function(){return this.repositories},getRepositoryByName:function(a){return _.find(this.repositories,function(b){return b.name==a})},eachRepository:function(a){_.each(this.repositories,function(b){a(b)})},filterRepositories:function(a){return _.filter(this.repositories,a)}},{repositories:[],
search:function(a,b,d){c.Repositories.repositories=[];c.Helper.callHttpApi({service:"legacy/repos/search/"+a,data:b,success:function(a){_.each(a.data.repositories,function(a){c.Repositories.repositories.push(new c.Repository(a.name,new c.User(a.owner),a))});d&&d(null,c.Repositories)},error:function(a){d&&d(Error(a))}})},reverse:function(){c.Repositories.repositories.reverse()},sort:function(a){a?c.Repositories.repositories.sort(a):c.Repositories.repositories.sort()},getAll:function(){return c.Repositories.repositories},
getByName:function(a){return _.find(c.Repositories.repositories,function(b){return b.name==a})},each:function(a){_.each(c.Repositories.repositories,function(b){a(b)})},filter:function(a){return _.filter(c.Repositories.repositories,a)}})}).call(this);if(!String.prototype.format)String.prototype.format=function(){var c=this;for(arg in arguments)c=c.replace(RegExp("\\{"+arg+"\\}","g"),arguments[arg]);return c};
(function(c){var f=function(a){for(var b="https://www.github.com",d=0;d<arguments.length;d++)b+="/"+arguments[d];return b},j=function(a){return a.committer&&a.committer.login?a.committer.login:a.author&&a.author.login?a.author.login:null};(c.jscommits={}).showCommits=function(a,b,d){var c=document.createElement("div");c.innerHTML="Latest commits for <a href='https://www.github.com/{0}/{1}'>{1}</a> repository.".format(a,b);c.className="jscommits-heading";var t=document.createElement("div");Gh3.Helper.callHttpApi({service:"repos/"+
a+"/"+b+"/commits",success:function(c){for(var d=15<c.data.length?15:c.data.length,e=!1,r=0;r<d;r++){var i=c.data[r],o=document.createElement("div"),m,h=a,s=b,g=i,k=m=document.createElement("a"),n=g.commit.message,p=n.indexOf("\n");if(0>p||0===p)p=n.length;n=n.substr(0,p);k.innerHTML=n;m.href=f(h,s,"commit",g.sha);h=document.createElement("span");h.className="jscommits-message";h.appendChild(m);m=h;g=i;h=j(g);s=i=document.createElement("a");k=j(g);if(!k)if(g=g.commit,g.author&&g.author.email)k=g.author.email;
else if(g.committer&&g.committer.email)k=g.committer.email;s.innerHTML=k;i.href=h?f(h):"#";h=document.createElement("span");h.className="jscommits-author";h.appendChild(i);i=h;o.className=e?"jscommits-commit flip-color":"jscommits-commit";o.appendChild(i);o.appendChild(m);t.appendChild(o);e=!e}}});d.className+=" jscommits-panel";d.appendChild(c);d.appendChild(t)}})(window);
const commitUrlRe = /^(?<site>.+)\/projects\/(?<project>.+)\/repos\/(?<repo>.+)\/pull-requests\/(?<pr>\d+)\/commits\/(?<commit>[a-f0-9]+)(?:#.*)?$/;
var oldHref = document.location.href;

let commitMessage = document.createElement("div");
commitMessage.className = "commit-message";
commitMessagePre = document.createElement("pre");
commitMessage.appendChild(commitMessagePre);
document.getElementById("pull-requests-container").insertBefore(commitMessage, document.querySelector("div.pull-request-tabs"));

function UpdateCommitMessage(url)
{
    const match = commitUrlRe.exec(url);
    if(match !== null)
    {
        apiCommit = `${match.groups.site}/rest/api/1.0/projects/${match.groups.project}/repos/${match.groups.repo}/commits/${match.groups.commit}`;
        fetch(apiCommit)
            .then(response => response.json())
            .then(function(data){
                commitMessagePre.innerText = data.message;
            });
    }
    else
    {
        commitMessagePre.innerText = "";
        console.log(url);
    }
}

var globalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (oldHref != document.location.href) {
            oldHref = document.location.href;
            
            UpdateCommitMessage(oldHref);
        }
    });
});

var config = {
    childList: true,
    subtree: true
};

globalObserver.observe(document.querySelector("body"), config);

window.addEventListener("load", () => {UpdateCommitMessage(oldHref);});

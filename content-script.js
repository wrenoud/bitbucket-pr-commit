const commitUrlRe = /^(?<site>.+)\/(?<type>projects|users)\/(?<project>.+)\/repos\/(?<repo>.+)\/pull-requests\/(?<pr>\d+)\/commits\/(?<commit>[a-f0-9]+)(?:#.*)?$/;

// add a div to hold the message
let commitMessage = document.createElement("div");
commitMessage.className = "commit-message";
commitMessagePre = document.createElement("pre");
commitMessage.appendChild(commitMessagePre);
document.getElementById("pull-requests-container").insertBefore(commitMessage, document.querySelector("div.pull-request-tabs"));

// update the commit message if we are looking at a single commit and not a full diff
function UpdateCommitMessage(url)
{
    const match = commitUrlRe.exec(url);
    if(match !== null)
    {
        const site = match.groups.site;
        const type = match.groups.type;
        const project = match.groups.project;
        const repo = match.groups.repo;
        const commit = match.groups.commit;

        apiCommit = `${site}/rest/api/1.0/${type}/${project}/repos/${repo}/commits/${commit}`;
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

// remember the previous location
var oldHref = document.location.href;

// create an DOM observer to watch for location changes and update the commit
var globalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (oldHref != document.location.href) {
            oldHref = document.location.href;
            
            UpdateCommitMessage(oldHref);
        }
    });
});
globalObserver.observe(document.querySelector("body"), {childList: true, subtree: true});

// make sure we check once on a fresh load
window.addEventListener("load", () => {UpdateCommitMessage(oldHref);});

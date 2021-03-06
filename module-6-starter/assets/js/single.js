//used to append all of these issueEls from the dom onto the actual web[age]
var isssueContainerEl = document.querySelector("#issues-container");
//container for limit warning
var limitWarningEl = document.querySelector("#limit-warning");
//var to hold query string of repo's issues page
var queryString =  document.location.search;
//dom reference to repo-name
var repoNameEl = document.querySelector("#repo-name");

var getRepoIssues = function(repo){
    //add the ? stmnt at the end to change the order they are listed in
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayIssues(data);
            //check if api has paginated issues
            if(response.headers.get("Link")){
                displayWarning(repo);
            }
            });
        }
        else{
            //send user to homepage
            document.location.replace("./index.html");
        }
    });
    //^must user promise syntax to access data in the reponse
};

//fucntion to display issue data into dom elements
var displayIssues = function(issues){   
    //see if there are issues in the repo
    if(issues.length === 0){
        isssueContainerEl.textContent = "This repo has no open issues!";
    }
    for(var i = 0;  i< issues.length; i++){
        //make link el to take user to the issue in question in gihub
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        //_blank opens new tab instead of replcing the current page
        issueEl.setAttribute("target", "_blank");
        //create span to hold issue
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        //append to container
        issueEl.appendChild(titleEl);
        //create a type element
        var typeEl = document.createElement("span");
        //see if issue is issue or pull request bc they both comeup 
        if(issues[i].pull_request){
            typeEl.textContent = "(Pull request)";
        }
        else{
            typeEl.textContent="(Issue)";
        }
        //append to container
        issueEl.appendChild(typeEl);
        isssueContainerEl.appendChild(issueEl);
        }
};

var displayWarning = function(repo){
    //add text to container
    limitWarningEl.textContent = "To see more than 30 repos, vitit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on Github.com";
    linkEl.setAttribute("href", "https://github.com/" +repo +"/issues");
    linkEl.setAttribute("target", "_blank");
    limitWarningEl.appendChild(linkEl);
};

//lets make this api call more dynamic
var getRepoName = function(){
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    //check if user entered valid repo name/no issues w it
    if(repoName){
        getRepoIssues(repoName);    
        repoNameEl.textContent =repoName;
    }
    else{
        //sends user back to search page
        document.location.replace("./index.html");
    }
};

getRepoName();

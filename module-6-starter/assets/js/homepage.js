//vars to store and reference search items
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var reposContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");
//getting api request
var getUserRepos = function(user){
    //format github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    //make request to url
    fetch(apiUrl).then(function(response){
      //refactored to show error msg if 404 occurs
      if(response.ok){
        response.json().then(function(data){
          displayRepos(data, user);
        });
      }
      else{
        alert("Error: Github username not found");
      }
    })
    //chained after the .then() method, this is bc data is retrieved and 
    //returned to then then method or this one if no data can be retrieved
    .catch(function(error){
      alert("Unable to connect to Github");
    })
};
getUserRepos();

var formSubmitHandler = function(event){
    event.preventDefault();
    //get el's input val
    var username = nameInputEl.value.trim();
    if (username) {
      getUserRepos(username);
      nameInputEl.value = "";
    } else {
      alert("Please enter a GitHub username");
    }
};

var displayRepos = function(repos, searchTerm){
  //lets user know if usernmae exists but has 0 repos
  //check w api to see if it returned repos
  if(repos.length === 0){
    reposContainerEl.textContent = "No repos found here.";
    return;
  } 
    console.log(repos);
    console.log(searchTerm);
    //clear out the old content
    reposContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
// loop over repos
for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
    //make container for each repo to link it to the page that displays that repo's issues
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    //appends query parameter to end of url with that repo's name
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
    // append to container
    repoEl.appendChild(titleEl);
    //make status el
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";
    //check if current repo has issues
    if(repos[i].open_issues_count > 0){
      statusEl.innerHTML = 
        "<i class='fas fa-times status-icon icon-danger'></i>"
        + repos[i].open_issues_count + " issue(s)";
    }
    else{
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    //append it to end of container
    repoEl.appendChild(statusEl);
    // append container to the dom
    reposContainerEl.appendChild(repoEl);
  }
};

//function to sorrt repos by language
var getFeaturedRepos = function(language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data.items, language);
      });
    } else {
      alert('Error: GitHub User Not Found');
    }
  });
};

var buttonClickHandler = function(event){
  var language = event.target.getAttribute("data-language");
  if(language){
    getFeaturedRepos(language);
    //clear old content
    reposContainerEl.textContent = "";
  }
};

languageButtonsEl.addEventListener("click", buttonClickHandler);
userFormEl.addEventListener("submit", formSubmitHandler);





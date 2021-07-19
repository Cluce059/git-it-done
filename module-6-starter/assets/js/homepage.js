var getUserRepost = function(){
    console.log("function called");
    fetch("https://api.github.com/users/octocat/repos");
};
getUserRepost();

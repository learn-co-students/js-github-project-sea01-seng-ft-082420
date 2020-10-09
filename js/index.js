window.addEventListener('DOMContentLoaded', function(){
    const usersDiv = document.getElementById('user-list');
    const reposDiv = document.getElementById('repos-list')
    const submitForm = document.getElementById('github-form');

    submitForm.addEventListener('submit', function(e){
        e.preventDefault();
        if (e.target[0].value === '') return;
        getUsers(e.target[0].value);
    });

    function getUsers(name){
        fetch(`https://api.github.com/search/users?q=${name}`,{
                method: 'GET',
                headers: {
                    'Accept':'application/vnd.github.v3+json'
                }
            })
        .then(resp => resp.json())
        .then(function(json){
            reposDiv.innerHTML = ""
            usersDiv.innerHTML = "<h3>User Results</h3>";
            json.items.forEach(user => buildUserLi(user));
        });
    }

    function buildUserLi(liObject){
        const li = document.createElement('li');
        const avatar = document.createElement('img');
        const nameSpan = document.createElement('span');
        const linkToProfile = document.createElement('a');

        linkToProfile.href = liObject.html_url;
        linkToProfile.textContent = "Profile";
        nameSpan.textContent = liObject.login;
        nameSpan.style = "margin: 0 5px;"
        avatar.src = liObject.avatar_url;
        avatar.style = 'width: 25px; margin: 0 5px;';

        nameSpan.addEventListener('click', function(e){
            getRepos(e, e.target.textContent)
        });

        li.appendChild(avatar);
        li.appendChild(nameSpan);
        li.append(linkToProfile);
        usersDiv.appendChild(li);
    }

    function getRepos(e, name){
        fetch(`https://api.github.com/users/${name}/repos`,{
                method: 'GET',
                headers: {
                    'Accept':'application/vnd.github.v3+json'
                }
            })
        .then(resp => resp.json())
        .then(function(json){
            usersDiv.innerHTML = "";
            usersDiv.appendChild(e.target.parentElement);
            reposDiv.innerHTML = "<h3>Repos</h3>";
            json.forEach(repo => buildReposLi(repo));
        });
    }

    function buildReposLi(liObject){
        const li = document.createElement('li');
        const linkToRepo = document.createElement('a');

        linkToRepo.href = liObject.html_url;
        linkToRepo.textContent = liObject.name;

        li.append(linkToRepo);
        reposDiv.appendChild(li);
    }
});

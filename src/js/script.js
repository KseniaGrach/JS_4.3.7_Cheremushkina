const searchInput = document.querySelector("input");
const searchList = document.querySelector(".drop-down__list");
const history = document.querySelector(".search__history");

history.addEventListener("click", function(event) {
    let task = event.target;

    if (!task.classList.contains("close")) 
        return;
    
    task.parentElement.remove();    
});

searchList.addEventListener("click", function(event) {
    let task = event.target;

    if (!task.classList.contains("drop-down__Item"))
        return;

    addItem(task);
    searchInput.value = "";
    deleteSearch();
});

function deleteSearch() {
    searchList.innerHTML = "";
}

function showSearchItem(repositories) {

    deleteSearch();

    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
        let name = repositories.items[repositoryIndex].name;
        let owner = repositories.items[repositoryIndex].owner.login;
        let stars = repositories.items[repositoryIndex].stargazers_count;

        let dropdownItem = `<div class="drop-down__Item" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
        searchList.innerHTML += dropdownItem;
    }
}

function addItem(task) {
    let name = task.textContent;
    let owner = task.dataset.owner;
    let stars = task.dataset.stars;
    
    history.innerHTML += `<div class="item_history">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="close"></button></div>`;
}

async function getSearchItem() {

    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");
    let repositoriesPart = searchInput.value;
    if (repositoriesPart == "") {
        deleteSearch();

	    return;
    }

    urlSearchRepositories.searchParams.append("q", repositoriesPart)

    try {
	    let response = await fetch(urlSearchRepositories);

        if (response.ok) {
            let repositories = await response.json();
            showSearchItem(repositories);
        } else {
            return null;
        }
    } catch(error) {
        return null;
    }
}

function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
        clearTimeout(timer);

        return new Promise((resolve) => {
            timer = setTimeout(
                () => resolve(fn(...args)),
                timeout,
            );
        });
    };
}

const getSearchItemDebounce = debounce(getSearchItem, 500);
searchInput.addEventListener("input", getSearchItemDebounce);
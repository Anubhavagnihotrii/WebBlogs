const itemsPerPage = 5;
let currentPage = 1;
let currentCategory = 'general';

async function fetchNewsByCategory(category) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${category}&apiKey=f8666caac58244af8bb49f6b13f67a4d`);
        const data = await response.json();

        if (data.articles) {
            displayArticles(data.articles);
        } else {
            console.error("Invalid data format:", data);
        }

        currentCategory = category;
    } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
    }
}


async function fetchNews() {
    const defaultCategory = 'general';
    fetchNewsByCategory(defaultCategory);
}

function displayArticles(articles) {
    var articlesSection = document.getElementById("articlesSection");

    if (!articles || !Array.isArray(articles)) {
        console.error("Invalid or empty articles array:", articles);
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentArticles = articles.slice(startIndex, endIndex);

    articlesSection.innerHTML = '';

    currentArticles.forEach(function (article, index) {
        var articleContainer = document.createElement("div");
        articleContainer.classList.add("mt-16","mb-4");

        articleContainer.innerHTML = `
            <h2 class="text-2xl font-bold mb-2">${article.title}</h2>
            <p class="text-gray-500 mb-2">Source: <span class="text-blue-500">${article.source.name}</span></p>
            <img src="${article.urlToImage}" alt="${article.title}" class="w-full">
            <p class="text-gray-700 mt-4">${article.description}</p>
            <a href="${article.url}" class="text-blue-500 underline inline-block mt-4" target="_blank" rel="noopener noreferrer">Read more</a>
        `;

        articlesSection.appendChild(articleContainer);

        if (index !== currentArticles.length - 1) {
            articlesSection.innerHTML += getCommentSection();
        }
    });

    updatePaginationButtons(articles.length);
}


function getCommentSection() {
    return `
        <section>
            <h2 class="text-xl font-bold mb-4">Comments</h2>
            <form class="commentForm">
                <label for="commentInput" class="block text-gray-700 text-sm font-bold mb-2">Leave a Comment:</label>
                <textarea class="w-full h-16 px-3 py-2 border rounded-md"></textarea>
                <button type="submit" class="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md">Submit Comment</button>
            </form>
            <ul class="commentsList mt-2 list-none p-0">
            </ul>
        </section>
    `;
}

function updatePaginationButtons(totalArticles) {
    const totalPages = Math.ceil(totalArticles / itemsPerPage);
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const currentPageElement = document.getElementById("currentPage");

    currentPage = Math.max(1, currentPage);

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
    currentPageElement.textContent = `Page ${currentPage}`;

    prevPageButton.removeEventListener("click", () => changePage(-1));
    nextPageButton.removeEventListener("click", () => changePage(1));

    prevPageButton.addEventListener("click", () => changePage(-1));
    nextPageButton.addEventListener("click", () => changePage(1));
}

function changePage(delta) {
    currentPage += delta;
    fetchNewsByCategory(currentCategory);
}

window.onload = fetchNews;

document.getElementById("menuToggle").addEventListener("click", function () {
    var navLinks = document.querySelector(".hidden.md\\:flex");
    navLinks.classList.toggle("hidden");
});

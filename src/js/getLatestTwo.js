let volumeTwo = {};
function fetchData() {
  fetch("/volumes/latest").then((response) => {
    response
      .json()
      .then((data) => {
        volumeTwo = data[1];
        return volumeTwo;
      })
      .then((data) => {
        document
          .querySelector("#latestVolLinkTwo")
          .insertAdjacentHTML(
            "beforeend",
            `<a href="/volumes/editorial/${data._id}" class="btn btn-primary" id="latestLinkTwo">Download Volume ${data.issue}</a> <a href="/volume/${data._id}" class="btn btn-primary" id="latestLinkTwo">View Articles</a>`
          );
        document.querySelector(
          "#volumeCoverTwo"
        ).innerHTML = `<a href="/volumes/cover/${data._id}"><img src="/volumes/cover/${data._id}" alt=""></a>`;
        document.querySelector(
          "#LatestVolumeTwo"
        ).innerHTML = `<h1>${data.name}</h1>`;
        document.querySelector(
          "#LatestVolumeTitleTwo"
        ).innerHTML = `<h2>${data.title}</h2>`;
        document.querySelector("#datePublishedTwo").textContent =
          data.publishedDate;
        document.querySelector("#volumeAbstractTwo").textContent =
          data.abstract;
        document.querySelector(
          "#latestButtonTwo"
        ).innerHTML = `<a href="/volume/${data._id}" class="btn btn-primary">View all</a>`;
        fetch(
          "/articles/volume/" + data._id + "?sortBy=createdAt:asc&feature=true"
        ).then((response) => {
          response.json().then((data) => {
            const html = data.articles
              .map((art) => {
                return `
                                    <div class="card" style="width: 100%;">
                                    <div class="card-body">
                                        <strong class="d-inline-block mb-2 text-dark">${art.author}</strong>
                                        <h3 class="mb-0">${art.title}</h3>
                                        <div class="mb-1 text-muted">${art.publishedDate}</div>
                                        <p class="card-text mb-auto">${art.abstract}</p>
                                        <a href="/articles/file/${art._id}" class="stretched-link">Continue reading</a>
                                    </div>
                                    </div>
`;
              })
              .join("");
            document.querySelector("#articlesTwo").innerHTML = html;
          });
        });
      });
  });
}

fetchData();

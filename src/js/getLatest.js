let volume = {}
function fetchData() {
    fetch('/volumes/latest').then((response) => {
        response.json().then((data) => {
            volume = data[0]

            return volume
        }).then((data) => {
            document.querySelector('#latestVolLink').insertAdjacentHTML('beforeend', `<a href="/volumes/editorial/${data._id}" class="btn btn-primary" id="latestLink">Download editorial</a> <a href="/volume/${data._id}" class="btn btn-primary" id="latestLink">View Articles</a>`)
            document.querySelector('#volumeCover').innerHTML = `<a href="/volumes/cover/${data._id}"><img src="/volumes/cover/${data._id}" alt=""></a>`
            document.querySelector('#LatestVolume').innerHTML = `<h1>${data.name}</h1>`
            document.querySelector('#LatestVolumeTitle').innerHTML = `<h2>${data.title}</h2>`
            document.querySelector('#datePublished').textContent = data.publishedDate
            document.querySelector('#volumeAbstract').textContent = data.abstract
            fetch('/articles/volume/' + data._id + '?sortBy=createdAt:asc&limit=4&feature=true').then((response) => {
                response.json().then((data) => {
                    const html = data.articles.map((art) => {
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
`
                    })
                        .join("")
                    document.querySelector('#articles').innerHTML = html
                })
            })
        })
    })
}

fetchData();
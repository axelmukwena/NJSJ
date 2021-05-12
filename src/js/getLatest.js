console.log('Client side javascript is running')
    let volume = {}
    function fetchData() {
        fetch('/volumes/latest').then((response) => {
            response.json().then((data) => {
                volume = data[0]

                return volume
            }).then((data) => {
                document.querySelector('#latestLink').insertAdjacentHTML('beforeend',`<a href="/volume/${data._id}" class="btn btn-primary" id="latestLink">View Volume</a>`)
                document.querySelector('#volumeCover').innerHTML = `<a href="/volumes/cover/${data._id}"><img src="/volumes/cover/${data._id}" alt=""></a>`
                document.querySelector('#LatestVolume').innerHTML = `<h1>${data.name}</h1>`
                document.querySelector('#LatestVolumeTitle').innerHTML =  `<h2>${data.title}</h2>`
                document.querySelector('#datePublished').textContent =  data.publishedDate
                fetch('/articles/volume/' + data._id+'?sortBy=createdAt:asc&limit=4').then((response) => {
                    response.json().then((data) => {
                        const html = data.articles.map((art) => {
                            return `<div class="col-md-6">
                                        <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                                            <div class="col p-4 d-flex flex-column position-static">
                                                <strong class="d-inline-block mb-2 text-dark">${art.author}</strong>
                                                <h3 class="mb-0">${art.title}</h3>
                                                <div class="mb-1 text-muted">${art.publishedDate}</div>
                                                <p class="card-text mb-auto">${art.abstract}</p>
                                                <a href="/articles/file/${art._id}" class="stretched-link">Continue reading</a>
                                            </div>
                                        </div>
                                    </div>`
                        })
                        .join("")
                        document.querySelector('#articles').innerHTML = html
                    })
                })
            })
        })
    }

    fetchData();
function fetchData(volume){
    fetch('/articles/volume/'+volume).then((response)=>{
        response.json().then((data)=>{
            const volumeName = data.volume.name
            document.querySelector('#volumeName').insertAdjacentHTML('beforeend',`<a href="/volumes/editorial/${data.volume._id}" class="btn btn-primary" id="latestLink">Download editorial</a> <a href="/submission/${data.volume._id}" class="btn btn-primary">Submit articles</a>`)
            document.querySelector('#volumeName').insertAdjacentHTML('afterbegin',`<h1 class="card-title">${volumeName}</h1> <h2 class="card-title">${data.volume.title}</h2>`)
            document.querySelector('#volumeCover').innerHTML = `<a href="/volumes/cover/${data.volume._id}"><img src="/volumes/cover/${data.volume._id}" alt=""></a>`
            document.querySelector('#datePublished').textContent =  data.volume.publishedDate
            document.querySelector('#volumeAbstract').textContent = data.volume.abstract

           const html = data.articles.map((article)=>{
                return `<div class="accordion-item">
                            <h2 class="accordion-header" id="heading${article._id}">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${article._id}"
                                    aria-expanded="true" aria-controls="collapse${article._id}">
                                    ${article.title}
                                </button>
                            </h2>
                            <div id="collapse${article._id}" class="accordion-collapse collapse show" aria-labelledby="heading${article._id}"
                                data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <h3>${article.author}</h3>
                                    <div>${article.publishedDate}</div>
                                    <p>${article.abstract}</p>
                                    <a href="/articles/file/${article._id}">Continue reading</a>
                                </div>
                            </div>
                        </div>`
            })
            .join("")

            document.querySelector('#accordionExample').innerHTML = html
        })
    })
}
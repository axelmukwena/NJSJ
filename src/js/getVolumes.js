function fetchData() {
  fetch("/volumes?sortBy=issue:asc").then((response) => {
    response.json().then((data) => {
      const html = data
        .map((volume) => {
          return `<li><a class="dropdown-item" href="/volume/${volume._id}">${volume.name}</a></li>`;
        })
        .join("");
      document
        .querySelector("#volumeLink")
        .insertAdjacentHTML("afterbegin", html);
    });
  });
}

fetchData();

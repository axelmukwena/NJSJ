function isAuthenticated() {
    const authCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        .split('=')[1];


    if (authCookie){
        document.getElementById('loginBtn').style.display = "none"
        document.getElementById('logoutBtn').style.display = "inline"
        document.getElementById('publish').style.display = "inline"
    }
}

isAuthenticated()
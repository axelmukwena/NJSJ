async function postData(url = '', data = {}, redirect) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    })
    if(response.ok){
        response.json().then((data)=>{
            const authCookie = document.cookie
            .split('; ')
            .find((row)=> row.startsWith('auth_token='))
            .split('=')[1];
        window.open(redirect,'_self')
        })
    }else{
        alert('unable to login')
    }
}

postData('users/login', {
    email: 'sibalatanics@outlook.com',
    password: 'Kurbeans1.'
},'/submission')
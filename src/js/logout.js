console.log('Client side javascript is running')
    async function logout() {
        const response = await fetch('/users/logout', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        })
        if(response.ok){
            window.open('/','_self')
        }else{
            alert('unable to login')
        }
    }
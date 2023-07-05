// import axios from "axios"

export default async function PrivatePostRessource(url, sendBody) {
    const response = await fetch({
        url: `${window.location.origin}/api/${url}`,
        method: "POST",
        credentials: 'same-origin',
        headers: {
            Accept: "application/ld+json",
            "Content-Type": "application/form-data"
        },
        body: sendBody
    })

    // const responseData = await response.json()
    console.log([
        response,
        // responseData
    ])
    if(response.status === 404) {
        // 
    } else if(response.status === 500) {
        // 
    } else if(response.status === 200) {
        // 
    }
}

// function AxiosGet() {
//     axios.get(`${window.location.origin}/api/${url}`).then(items => {
//         console.log(items.data)
//     })
// }
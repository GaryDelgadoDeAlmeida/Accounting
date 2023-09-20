import axios from "axios";
import React, { useCallback, useState } from "react";

/**
 * This will be used to fetch the private resources from the protected route of the API and display it to the users.
 */
export default function PrivateResources(route) {
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    const load = useCallback(async () => {
        setLoading(true)
        
        // const response = await fetch(`${window.location.origin}/api/${route}`, {
        //     method: "GET",
        //     credentials: 'same-origin',
        //     headers: {
        //         "Accept": "application/ld+json",
        //         "Content-Type": "application/json"
        //     }
        // })

        // const responseJson = await response.json()
        // if(response.ok) {
        //     setItems(responseJson)
        // } else {
        //     console.error(responseJson)
        // }

        const {data: response} = await axios
            .get(route, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        ;
        
        setItems(response)

        setLoading(false)
    }, [route])

    return {loading, items, load}
}
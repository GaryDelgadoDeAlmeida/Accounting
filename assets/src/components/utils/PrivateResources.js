import React, { useCallback, useState } from "react";

/**
 * This will be used to fetch the private resources from the protected route of the API and display it to the users.
 */
export default function PrivateResources(url) {
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    const load = useCallback(async () => {
        setLoading(true)
        
        const response = await fetch(`${window.location.origin}/api/${url}`, {
            method: "GET",
            headers: {
                "Accept": "application/ld+json",
                "Content-Type": "application/json"
            }
        })

        const responseJson = await response.json()
        if(response.ok) {
            setItems(responseJson)
        } else {
            console.error(responseJson)
        }

        setLoading(false)
    }, [url])

    return {loading, items, load}
}
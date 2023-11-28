import React, { useCallback, useState } from "react";
import axios from "axios";

/**
 * This will be used to fetch the private resources from the protected route of the API and display it to the users.
 */
export default function PrivateResources(route) {
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    
    const load = useCallback(async () => {
        setLoading(true)

        const {data: response} = await axios
            .get(route, {
                headers: {
                    "Content-Type": "application/json",
                    "Credentials": "same-origin",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then((response) => {
                setItems(response.data)
            })
            .catch((err) => console.log(err))
        ;
        setItems(response)

        setLoading(false)
    }, [route])

    return {loading, items, load}
}
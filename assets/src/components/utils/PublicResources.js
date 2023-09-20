import React, { useCallback, useState } from "react";
import axios from "axios";

/**
 * This will fetch the resources from the public route for all users.
 */
export default function PublicResources(route) {
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState({})
    const load = useCallback(async () => {
        setLoading(true)
        
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
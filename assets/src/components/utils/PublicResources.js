import React from "react";
import axios from "axios";

/**
 * This will fetch the resources from the public route for all users.
 */
export default function PublicResources(route) {
    axios
        .get(`${window.location.origin}/api/${route}`)
        .then(res => console.log(res))
        .catch(err => console.log(err))
}
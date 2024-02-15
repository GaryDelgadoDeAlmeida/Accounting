import React from "react"
import axios from "axios"
import { findChildren } from "../utils/DomElement"

export default function RemoveButton({removeUrl, parentElementId, smallSizeBtn = false}) {

    const storageUser = localStorage.getItem("user") ?? []
    const user = JSON.parse(storageUser)

    const handleMouseEnter = (e) => {
        let child = findChildren(e.target, undefined, "IMG")
        if(child) {
            child.src = `${window.location.origin}/content/svg/trash-red.svg`
        }
    }

    const handleMouseLeave = (e) => {
        let child = findChildren(e.target, undefined, "IMG")
        if(child) {
            child.src = `${window.location.origin}/content/svg/trash-white.svg`
        }
    }
    
    const handleRemove = (e) => {
        if(!confirm("Are you sure you want to delete this invoice ?")) {
            return
        }
        
        let parent = document.getElementById(parentElementId)
        if(!parent) {
            return
        }

        axios
            .delete(removeUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld",
                    "Authorization": "Bearer " + user.token
                }
            })
            .then(response => {
                console.log(response, response.data, response.status)
                parent.remove()
            })
            .catch(({response}) => {
                let errorMessage = "An error has been encountered. Please, retry later."
                if(response.data.message) {
                    errorMessage = response.data.message
                } else if(response.data.detail) {
                    errorMessage = response.data.detail
                }

                alert(errorMessage)
            })
        ;
    }

    return (
        <button 
            className={`btn ${smallSizeBtn ? "btn-sm" : ""} btn-red -inline-flex`} 
            onMouseEnter={(e) => handleMouseEnter(e)} 
            onMouseLeave={(e) => handleMouseLeave(e)}
            onClick={(e) => handleRemove(e)}
        >
            <img src={`${window.location.origin}/content/svg/trash-white.svg`} alt={""} />
        </button>
    )
}
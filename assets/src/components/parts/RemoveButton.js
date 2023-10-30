import React from "react"
import axios from "axios"
import { findChildren } from "../utils/DomElement"

export default function RemoveButton({removeUrl, parentElementId, smallSizeBtn = false}) {

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
        console.log(parent, parentElementId)
        if(!parent) {
            return
        }

        axios
            .delete(removeUrl, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                console.log(response, response.data, response.status)
                parent.remove()
            })
            .catch(error => {
                console.log(error)
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
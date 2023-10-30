import React from "react";
import { Link } from "react-router-dom";
import { findChildren } from "../utils/DomElement";
import { useEffect, useState } from "react";

export default function LinkButton({classname, value, url, defaultIMG, smallSizeBtn = false}) {

    const [colorIMG, setColorIMG] = useState("")

    useEffect(() => {
        switch(classname) {
            case "btn-red":
                setColorIMG("red")
                break
    
            case "btn-blue":
                setColorIMG("blue")
                break
    
            case "btn-yellow":
                setColorIMG("yellow")
                break
            
            case "btn-orange":
                setColorIMG("orange")
                break
    
            case "btn-grey":
                setColorIMG("grey")
                break
    
            default:
                break
        }
    }, [])

    const handleMouseEnter = (e) => {
        let child = findChildren(e.target, undefined, "IMG")
        if(child) {
            child.src = `${window.location.origin}/content/svg/${defaultIMG}-${colorIMG}.svg`
        }
    }

    const handleMouseLeave = (e) => {
        let child = findChildren(e.target, undefined, "IMG")
        if(child) {
            child.src = `${window.location.origin}/content/svg/${defaultIMG}-white.svg`
        }
    }
    
    return (
        <Link 
            to={url}
            className={`btn ${classname} ${defaultIMG !== undefined ? "-inline-flex" : ""} ${smallSizeBtn ? "btn-sm" : ""}`} 
            onMouseEnter={(e) => handleMouseEnter(e)}
            onMouseLeave={(e) => handleMouseLeave(e)}
        >
            {defaultIMG !== undefined && (
                <img src={`${window.location.origin}/content/svg/${defaultIMG}-white.svg`} alt={""} />
            )}
            
            {value !== undefined && (
                <span>{value}</span>
            )}
        </Link>
    )
}
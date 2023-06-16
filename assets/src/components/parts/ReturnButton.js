import React from "react";
import { Link } from "react-router-dom";
import { findChildren } from "../utils/DomElement";

export default function ReturnButton({path}) {

    const handleMouseEnter = (e) => {
        let child = findChildren(e.target, undefined, "IMG")
        if(child) {
            child.src = `${window.location.origin}/content/svg/arrow-left-blue.svg`
        }
    }

    const handleMouseLeave = (e) => {
        let child = findChildren(e.target, undefined, "IMG")
        if(child) {
            child.src = `${window.location.origin}/content/svg/arrow-left-white.svg`
        }
    }

    return (
        <Link 
            to={path}
            className={"btn btn-blue -inline-flex"}
            onMouseEnter={(e) => handleMouseEnter(e)}
            onMouseLeave={(e) => handleMouseLeave(e)}
        >
            <img src={`${window.location.origin}/content/svg/arrow-left-white.svg`} alt={""} />
            <span>Retour</span>
        </Link>
    )
}
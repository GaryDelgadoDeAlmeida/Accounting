import React from "react";
import AnonymousHeader from "../parts/AnonymousHeader";
import ReturnButton from "../parts/ReturnButton";

export default function NotFound() {

    return (
        <AnonymousHeader>
            <div className={"page-section"}>
                <h3 className={"title"}>Page not found</h3>
                <p>The page you are looking at don't exist</p>
                <ReturnButton path={"/"} />
            </div>
        </AnonymousHeader>
    )
}
import React from "react";
import { Link } from "react-router-dom";

export default function AnonymousHeader(props) {

    return (
        <div className={"page"}>
            <div className={"page-header -user"}>
                <ul className={"vertical-menu"}>
                    <li><Link to={"/"}>Home</Link></li>
                    <li><Link to={"/policy"}>Policy</Link></li>
                    <li><Link to={"/login"}>Login</Link></li>
                </ul>
            </div>

            <div className={"page-content"}>
                {props.children}
            </div>

            <div className={"page-footer"}>
                <div className={"footer-copyright"}>
                    <p>
                        &copy; 2023 Accounting
                    </p>
                </div>
                
                <div className={"footer-links"}>
                    <Link to={"/policy"}>Policy</Link>
                    <span>•</span>
                    <Link to={"/contact"}>Contact</Link>
                    <span>•</span>
                    <Link to={"/disclamer"}>Disclamer</Link>
                </div>
            </div>
        </div>
    )
}
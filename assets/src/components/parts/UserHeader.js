import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

export default function UserHeader(props) {

    const storageUser = localStorage.getItem("user") ?? {}
    const [logged, setLogged] = useState(storageUser.length > 0 ? true : false)

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.setItem("user", "")
        setLogged(false)
    }

    return (
        <>
            {!logged && (<Navigate to={"/login"} />)}
            
            <div className={"page -admin"}>
                <div className={"page-header -admin"}>
                    {/* <img className={"horizontal-menu-logo"} src={`${window.location.origin}/content/img/logo.jpg`} alt={"logo"} /> */}
                    <ul className={"horizontal-menu"}>
                        <li><Link to={"/user"}>Home</Link></li>
                        <li><Link to={"/user/client"}>Client</Link></li>
                        <li><Link to={"/user/estimate"}>Estimate</Link></li>
                        <li><Link to={"/user/invoice"}>Invoice</Link></li>
                        <li><Link to={"/user/accounting"}>Accounting</Link></li>
                        <li><Link to={"/user/settings"}>Settings</Link></li>
                        <li><Link to={"/logout"} onClick={(e) => handleLogout(e)}>logout</Link></li>
                    </ul>
                </div>

                <div className={"page-content -admin"}>
                    <div className={"page-menu"}>
                        <label className={"icon-menu"} htmlFor={"burger"}>
                            <img src={`${window.location.origin}/content/svg/bars-white.svg`} alt={""} />
                        </label>

                        <input id={"burger"} type={"checkbox"} hidden />
                        <ul className={"mobile-menu"}>
                            <li><Link to={"/user"}>Home</Link></li>
                            <li><Link to={"/user/client"}>Client</Link></li>
                            <li><Link to={"/user/estimate"}>Estimate</Link></li>
                            <li><Link to={"/user/invoice"}>Invoice</Link></li>
                            <li><Link to={"/user/accounting"}>Accounting</Link></li>
                            <li><Link to={"/user/settings"}>Settings</Link></li>
                            <li><Link to={"/logout"} onClick={(e) => handleLogout(e)}>logout</Link></li>
                            <label className={"icon-menu"} htmlFor={"burger"}>
                                <img src={`${window.location.origin}/content/svg/xmark-white.svg`} alt={""} />
                            </label>
                        </ul>
                    </div>

                    <div className={"page-wrapper mh-100vh"}>
                        {props.children}
                    </div>

                    <div className={"page-footer"}>
                        <div className={"footer-copyright"}>
                            <p>
                                &copy; 2023 Accounting
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
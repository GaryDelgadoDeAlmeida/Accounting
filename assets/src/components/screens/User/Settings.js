import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserHeader from "../../parts/UserHeader";
import Notification from "../../parts/Notification";
import PrivateResources from "../../utils/PrivateResources";
import UserForm from "../../forms/UserForm";
import PasswordForm from "../../forms/PasswordForm";
import UserCorporationForm from "../../forms/UserCorporationForm";
import axios from "axios";
import RemoveAccountButton from "../../parts/RemoveAccountButton";

export default function Settings() {

    const storageUser = localStorage.getItem("user") ?? {}
    const [logged, setLogged] = useState(storageUser.length > 0 ? true : false)

    const allowedOgnlet = ["my-account", "corporation", "security"]
    const [onglet, setOnglet] = useState("my-account")
    const { loading, items: user, load } = PrivateResources(`${window.location.origin}/api/profile`)

    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            {!logged && (<Navigate to={"/login"} />)}

            <div className={"page-section"}>
                {!loading ? (
                    <div className={"d-flex-row -g-15px"}>
                        <div className={"vertical-sub-menu w-200px"}>
                            <li><button className={onglet === allowedOgnlet[0] ? "active" : null} onClick={(e) => setOnglet(allowedOgnlet[0])}>My account</button></li>
                            <li><button className={onglet === allowedOgnlet[1] ? "active" : null} onClick={(e) => setOnglet(allowedOgnlet[1])}>Corporation</button></li>
                            <li><button className={onglet === allowedOgnlet[2] ? "active" : null} onClick={(e) => setOnglet(allowedOgnlet[2])}>Account security</button></li>
                        </div>
                        
                        <div className={"onglet-content w-100"}>
                            {onglet === "my-account" && (
                                <div className={"card"}>
                                    <div className={"-header"}>
                                        <label>Personal informations</label>
                                    </div>
                                    <div className={"-content"}>
                                        <UserForm user={user} />
                                    </div>
                                </div>
                            )}

                            {onglet === "corporation" && (
                                <div className={"card"}>
                                    <div className={"-header"}>
                                        <label>Corporation</label>
                                    </div>
                                    <div className={"-content"}>
                                        <UserCorporationForm freelance={user.freelance} />
                                    </div>
                                </div>
                            )}

                            {onglet === "security" && (
                                <>
                                    <div className={"card"}>
                                        <div className={"-header"}>
                                            <label>Change your password</label>
                                        </div>
                                        <div className={"-content"}>
                                            <PasswordForm user={user} />
                                        </div>
                                    </div>

                                    <div className={"mt-15px"}>
                                        <RemoveAccountButton setLogged={setLogged} />
                                    </div>
                                </>
                            )}

                            {allowedOgnlet.indexOf(onglet) === -1 && (
                                <Notification classname={"danger"} message={`The onglet ${onglet} is forbidden`} />
                            )}
                        </div>
                    </div>
                ) : (
                    <Notification classname={"information"} message={"Loading ..."} />
                )}
            </div>
        </UserHeader>
    )
}
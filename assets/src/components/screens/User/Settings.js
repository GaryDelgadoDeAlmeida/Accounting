import React, { useState } from "react";
import UserHeader from "../../parts/UserHeader";
import UserForm from "../../forms/UserForm";
import PasswordForm from "../../forms/PasswordForm";
import UserCorporationForm from "../../forms/UserCorporationForm";
import Notification from "../../parts/Notification";

export default function Settings() {

    const userID = localStorage.getItem("user") ?? 1
    const allowedOgnlet = ["my-account", "corporation", "security"]
    const [onglet, setOnglet] = useState("my-account")

    return (
        <UserHeader>
            <div className={"page-section"}>
                <div className={"d-flex-row"}>
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
                                    <UserForm userID={userID} />
                                </div>
                            </div>
                        )}

                        {onglet === "corporation" && (
                            <div className={"card"}>
                                <div className={"-header"}>
                                    <label>Corporation</label>
                                </div>
                                <div className={"-content"}>
                                    <UserCorporationForm userID={userID} />
                                </div>
                            </div>
                        )}

                        {onglet === "security" && (
                            <div className={"card"}>
                                <div className={"-header"}>
                                    <label>Change your password</label>
                                </div>
                                <div className={"-content"}>
                                    <PasswordForm userID={userID} />
                                </div>
                            </div>
                        )}

                        {allowedOgnlet.indexOf(onglet) === -1 && (
                            <Notification classname={"danger"} message={`The onglet ${onglet} is forbidden`} />
                        )}
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}
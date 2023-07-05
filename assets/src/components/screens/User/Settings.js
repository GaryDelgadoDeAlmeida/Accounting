import React, { useState } from "react";
import UserHeader from "../../parts/UserHeader";
import UserForm from "../../forms/UserForm";
import PasswordForm from "../../forms/PasswordForm";
import Notification from "../../parts/Notification";

export default function Settings() {

    const allowedOgnlet = ["my-account", "security", "corporation"]
    const [onglet, setOnglet] = useState("my-account")

    return (
        <UserHeader>
            <div className={"page-section"}>
                <div className={"d-flex-row"}>
                    <div className={"vertical-sub-menu w-200px"}>
                        <li><button className={"active"} onClick={(e) => setOnglet("my-account")}>My account</button></li>
                        <li><button onClick={(e) => setOnglet("corporation")}>Corporation</button></li>
                        <li><button onClick={(e) => setOnglet("security")}>Account security</button></li>
                    </div>
                    
                    <div className={"onglet-content w-100"}>
                        {onglet === "my-account" ? (
                            <div className={"card"}>
                                <div className={"-header"}>
                                    <label>My account</label>
                                </div>
                                <div className={"-content"}>
                                    <UserForm />
                                </div>
                            </div>
                        ) : null}

                        {onglet === "security" ? (
                            <div className={"card"}>
                                <div className={"-header"}>
                                    <label>Change your password</label>
                                </div>
                                <div className={"-content"}>
                                    <PasswordForm />
                                </div>
                            </div>
                        ) : null}

                        {onglet === "corporation" ? (
                            <Notification classname={"information"} message={"Section under construction"} />
                        ) : null}

                        {allowedOgnlet.indexOf(onglet) === -1 ? (
                            <Notification classname={"danger"} message={`The onglet ${onglet} is forbidden`} />
                        ) : null}
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}
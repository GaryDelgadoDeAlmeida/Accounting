import React from "react";
import RegisterForm from "../forms/RegisterForm";

export default function Register() {
    return (
        <div className={"page"}>
            <div className={"page-content"}>
                <div className={"page-wrapper p-0 d-flex m-auto mh-100vh"}>
                    <div className={"login-block"}>
                        <div className={"-hero"}></div>
                        <div className={"-form"}>
                            <div className={"-form-wrapper"}>
                                <h2 className={"-form-title"}>Sign up</h2>
                                <RegisterForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
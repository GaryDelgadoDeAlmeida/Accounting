import React from "react";
import LoginForm from "../forms/LoginForm";
import LinkButton from "../parts/LinkButton";

export default function Login() {
    return (
        <div className={"page"}>
            <div className={"page-content"}>
                <div className={"page-wrapper d-flex m-auto"}>
                    <div className={"login-block"}>
                        <div className={"-hero"}></div>
                        <div className={"-form"}>
                            <div className={"-form-wrapper"}>
                                <h2 className={"-form-title"}>Sign in</h2>
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
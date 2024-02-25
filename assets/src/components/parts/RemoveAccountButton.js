import React from "react";
import axios from "axios";

export default function RemoveAccountButton({setLogged}) {

    const storageUser = localStorage.getItem("user") ?? {}
    const user = JSON.parse(storageUser)

    const handleRemoveAccount = (e) => {
        if(confirm("Are you sure you want to remove your account and all datas associeted to your account ?") === false) {
            return
        }

        axios
            .delete(`${window.location.origin}/api/profile/remove`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld",
                    "Authorization": "Bearer " + user ? user.token : ""
                }
            })
            .then((response) => {
                if(response.status == 202) {
                    localStorage.setItem("user", null)
                    setLogged(false)
                }
            })
            .catch(({response}) => {
                let errorMessage = "An error has been encountered. Please retry later"
                if(response.data != "") {
                    errorMessage = response.data
                }

                alert(errorMessage)
            })
        ;
    }

    return (
        <button className={"btn btn-red -inline-flex"} onClick={(e) => handleRemoveAccount(e)}>
            <img src={`${window.location.origin}/content/svg/trash-white.svg`} alt={"trash"} />
            <span>Remove your account</span>
        </button>
    )
}
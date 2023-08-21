import React from "react";
import { Route, Routes } from "react-router-dom";

// Commum
import Login from "./screens/Login";
import Register from "./screens/Register";

// Anonymous
import Home from "./screens/Anonymous/Home";
import Policy from "./screens/Anonymous/Policy";
import Disclamer from "./screens/Anonymous/Disclamer";

// User
import UserHome from "./screens/User/Home";
import UserClient from "./screens/User/Client";
import UserClientSingle from "./screens/User/ClientSingle";
import UserClientNew from "./screens/User/ClientNew";
import UserClientEdit from "./screens/User/ClientEdit";
import UserClientEstimateNew from "./screens/User/ClientEstimateNew";
import UserClientInvoiceNew from "./screens/User/ClientInvoiceNew";
import UserEstimate from "./screens/User/Estimate";
import UserEstimateSingle from "./screens/User/EstimateSingle";
import UserEstimateNew from "./screens/User/EstimateNew";
import UserInvoice from "./screens/User/Invoice";
import UserInvoiceSingle from "./screens/User/InvoiceSingle";
import UserInvoiceNew from "./screens/User/InvoiceNew";
import UserAccounting from "./screens/User/Accounting";
import UserSettings from "./screens/User/Settings";
import NotFound from "./screens/NotFound";

export default function RoutesConfig() {

    return (
        <>
            <Routes>
                {/* Anonymous */}
                <Route path={"/"} element={<Home />} />
                <Route path={"/policy"} element={<Policy />} />
                <Route path={"/disclamer"} element={<Disclamer />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/register"} element={<Register />} />
                
                {/* User */}
                <Route path={"/user"} element={<UserHome />} />
                <Route path={"/user/client"} element={<UserClient />} />
                <Route path={"/user/client/new"} element={<UserClientNew />} />
                <Route path={"/user/client/:clientID"} element={<UserClientSingle />} />
                <Route path={"/user/client/:clientID/edit"} element={<UserClientEdit />} />
                <Route path={"/user/client/:clientID/estimate"} element={<UserClientEstimateNew />} />
                <Route path={"/user/client/:clientID/estimate/:estimateID"} element={"Hi"} />
                <Route path={"/user/client/:clientID/invoice"} element={<UserClientInvoiceNew />} />
                <Route path={"/user/client/:clientID/invoice/:invoiceID"} element={"Hi"} />
                <Route path={"/user/estimate"} element={<UserEstimate />} />
                <Route path={"/user/estimate/new"} element={<UserEstimateNew />} />
                <Route path={"/user/estimate/:estimateID"} element={<UserEstimateSingle />} />
                <Route path={"/user/invoice"} element={<UserInvoice />} />
                <Route path={"/user/invoice/new"} element={<UserInvoiceNew />} />
                <Route path={"/user/invoice/:invoiceID"} element={<UserInvoiceSingle />} />
                <Route path={"/user/accounting"} element={<UserAccounting />} />
                <Route path={"/user/settings"} element={<UserSettings />} />

                {/* Common */}
                <Route path={"*"} element={<NotFound />} />
            </Routes>
        </>
    )
}
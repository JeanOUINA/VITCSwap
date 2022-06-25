import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import * as React from "react"
import Navbar from "../components/Navbar";
import { PageFetcher } from "../app";
import { Toaster } from "react-hot-toast";
import darkTheme from "../themes/dark";

export default function Main(){
    return <Router>
        <div>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: darkTheme.palette.secondary.dark,
                    color: "#fff"
                }
            }}/>
            <Navbar />
            <Switch>
                {/** HOME SECTION */}
                <Route path="/" exact>
                    <PageFetcher page="home/home"/>
                </Route>
            </Switch>
        </div>
    </Router>
}
import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Amplify from 'aws-amplify';
import { BrowserRouter as Router, Switch, Route, Match } from "react-router-dom"
import SideNav from "./components/SideNav";
import { createStore, combineReducers } from "redux"
import Modal from "./components/Modal"
import AppContent from "./components/AppContent"
import LandingContent from "./landingComponents/LandingContent"
import AdminContent from "./adminComponents/AdminContent"
import { ProtectedRoute, StylistProtectedRoute ,AdminProtectedRoute } from "./CustomRoutes"
import NotFound from "./general/NotFound";
import StylistContent from "./stylistComponents/StylistContent"

//Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'eu-west-2:940e23f6-b3b1-4200-8a9d-3729fa5e7d97',
        
        // REQUIRED - Amazon Cognito Region
        region: 'eu-west-2',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
        // Required only if it's different from Amazon Cognito Region
        //identityPoolRegion: 'eu-west-2',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'eu-west-2_x5atHpPTt',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '4o2q5borbhu94o7ve9tskjm0ic',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: true
    },
    Storage: {
        AWSS3: {
            bucket: 'adla-data',//'Adla-data', //REQUIRED -  Amazon S3 bucket
            region: 'eu-west-1', //OPTIONAL -  Amazon service region
        }
    }
});

/*
const navbarHeight = 8
const tabHeight = 8
const tabIconHeight= 5
const bodyHeight = 100 - (navbarHeight + tabHeight + tabIconHeight)
*/

window.styles = [
    'vintage',
    // 'oversized',
    'high-end',
    // 'color',
    // 'emo',
    'basic',
    'preppy',
    'streetwear',
    'boho',
    'sporty',
    'gothic',
    'e-girl/boy',
    // 'french',
    'italian',
    'kawaii',
    'androgenous',
    'punk',
    'casual',
    'festival',
    'tactical',
    'futuristic',
    // 'sexy',
    'chic',
    'cute',
    'grunge',
    // '70s',
    '80s',
    '90s',
    // 'hot',
    // 'unique'
]


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        console.log('rendering app')
        return (
            <Router >                   
                <div className="App">
                    <Switch>
                        <AdminProtectedRoute path ="/5015db37-0d03-4f44-93a5-606ac215935b/admin" component={AdminContent} />
                        <StylistProtectedRoute path ="/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist" component={StylistContent} />
                        <ProtectedRoute path="/app" component={AppContent}/>
                        {/* <Route path="/whatsapp" exact component={(props) => {
                            console.log('PROPS:', props)
                            window.location = `https://wa.me/447388648401?text=Hey%20Adla!%0AI%20want%20your%20help%20finding%20something!%0A${props.location.request}`}
                        }/> */}
                        <Route path="/" component={LandingContent} />
                        <Route component={NotFound} path=""/> 
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;//withAuthenticator(App);
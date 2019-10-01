import React, { Component } from "react";
import "./App.css";
import Amplify from 'aws-amplify';
import { BrowserRouter as Router, Switch, Route, Match } from "react-router-dom"
import AppContent from "./components/AppContent"
import LandingContent from "./landingComponents/LandingContent"
import { ProtectedRoute, StylistProtectedRoute ,AdminProtectedRoute } from "./CustomRoutes"
import NotFound from "./general/NotFound";

//Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        // identityPoolId: 'eu-west-2:855cf335-a3b7-4b7f-b47d-dc9fd044bd9b',
        
        // REQUIRED - Amazon Cognito Region
        region: 'eu-west-2',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
        // Required only if it's different from Amazon Cognito Region
        //identityPoolRegion: 'eu-west-2',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'eu-west-2_GcInwIQL0',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '5h9su4gmb1fkkfcims9dluhq1r',

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

window.title = 'your title'

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
                        <ProtectedRoute path="/app" component={AppContent}/>
                        <Route path="/" component={LandingContent} />
                        <Route component={NotFound} path=""/> 
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;
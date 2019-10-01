import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { combineReducers } from "redux"
import { Auth } from "aws-amplify"
import { createStore} from "redux";
import { makeGetRequest } from "./api_calls"

//window.screen.lockOrientation('portrait')
console.log(window.screen.orientation)

// REDUCERS 
const user = (state = {}, action) => {
    switch (action.type) {
        case "LOG_OUT" :
            console.log('logging out')
            return {
                logged_in: false
            }
        case "LOG_IN" :
            console.log('logging in')
            return {
                user_id: action.user_id,
                gender: action.gender,
                logged_in: true
            }
        default:
            return state
    }
}

const sideNav = (state = {open: false}, action) => {
    switch (action.type) {
        case "TOGGLE_SIDENAV" :
            console.log('toggling sidenav')
            return {
                ...state,
                open: !state.open
            }
        default:
            return state
    }
}

const style = (state={brands: []}, action) => {
    switch(action.type) {
        case "SET_BRANDS" :
            console.log('setting brand')
            return {
                ...state,
                brands: action.brand
            }
        case "UNLIKE_BRAND" :
            console.log('unliking brand:', action.brand)
            return {
                ...state,
                brands:  state.brands.filter((item, index) => index !== state.brands.indexOf(action.brand))
            }
        case "LIKE_BRAND" :
            console.log('liking brand:', action.brand)
            return {
                ...state,
                brands: state.brands.concat([action.brand])
            }
        case "LOG_OUT":
            return {brands: []}
        default:
            return state
    }
}

const requests = (state=[], action) => {
    switch (action.type) {
        case "SET_REQUESTS":
            return action.requests
        case "LOG_OUT":
            return []
        default:
            return state
    }
}

const slideUp = (state={open: false, content: null}, action) => {
    switch (action.type) {
        case "OPEN_SLIDEUP":
            console.log('opening slideup')
            return {
                open: true,
                content: action.content
            }
        case "CLOSE_SLIDEUP":
            console.log('closing slideup')
            return {
                open: false,
                content: null
            }
        default:
            return state
    }
}

const modal = (state={open: false, content: null}, action) => {
    switch (action.type) {
        case "OPEN_MODAL": 
            console.log('opening modal')
            return {
                open: true,
                content: action.content
            }
        case "CLOSE_MODAL":
            console.log('closing modal')
            return {
                open: false,
                content: null
            }
        default:
            return state
    }
}

var reducer = combineReducers({
    user,
    sideNav,
    style,
    requests,
    slideUp,
    modal
})

const store = createStore(reducer)

/*
fetch("https://api.myjson.com/bins/19dtxc")
.then(
    ({ data }) => {
        dispatch({
            type: "SET_BRANDS", 
            brands: data.brands
        });
    }
);
*/

// GET LIKED BRANDS
// is this going to be a problem if users sign in after this has been executed??? 
// could make it a function and call it again when LOGIN is dispatched
Auth.currentSession()
.then(
    data => {
        var IDToken = data.getIdToken().getJwtToken()
        var options = {
            method: 'GET',
            headers: {
                        "Authorization": IDToken,
            }
        }
        fetch('https://ikpilfsw9a.execute-api.eu-west-2.amazonaws.com/prod/get-my-liked-brands', options)       // get brands user has liked
        .then(data => data.json())
        .then(data => {
            /*
            console.log(data)
            console.log(JSON.parse(data.body))
            console.log(data)
            */
            data = JSON.parse(data.body)
            if (data == null) {
                var liked = []
            } 
            else {
                var liked = data.brands
            }
            /*this.setState({liked: liked}, 
                () => this.setState({btns: this.getBtns(this.icons)})
            )
            */
            store.dispatch({
                type: "SET_BRANDS",
                brand: liked
            })
        }) 
        .catch(err => console.log(err))    
    }
)

makeGetRequest('get-my-requests', data => {
    data = data.body
    data = JSON.parse(data)
    store.dispatch({type: "SET_REQUESTS", requests: data})
}
)

// GET LOGIN DETS
Auth.currentUserInfo()
.then(
    data => {
        console.log('initial user info:', data)
        if (data) {
            store.dispatch({type: "LOG_IN"})
        }
    }
)

ReactDOM.render(
    <App />
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

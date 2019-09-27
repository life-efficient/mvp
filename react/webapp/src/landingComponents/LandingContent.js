import React from "react"
import { Route, Switch } from "react-router-dom"
import Index from "./Index";
import Login from "../general/Login";
import Help from "./Help"
import NotFound from "../general/NotFound";
import { combineReducers, createStore } from "redux"
import { Provider } from "react-redux"
import Navbar from "./Navbar";
import Tabs from "../general/Tabs"

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
        case "SET_USER":
            return {
                ...state,
                ...action.update
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

const reducer = combineReducers({
    modal,
    slideUp,
    user,
    sideNav
})

const store = createStore(reducer)

const LandingRoutes = () => {
            //<Tabs />
    return (
        <Switch>
          <Route path="/" exact component={Index} />
          <Route path="/login" component={Login} />
          <Route path="/help" exact component={Help} />
          <Route component={NotFound} path=""/> 
        </Switch>
    )
}

const LandingContent = () => {
    return (
        <React.Fragment>
            <Provider store={store}>
                <Navbar/>
            </Provider>
        </React.Fragment>
    )
}

export default LandingContent
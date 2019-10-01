import React from "react"
import { Route, Redirect } from "react-router-dom"
import SideNav from "../general/SideNav"
import Home from "./Home";
import Modal from "../general/Modal"
import { combineReducers, createStore } from "redux"
import { Provider } from "react-redux"
import { makeGetRequest } from "../api_calls";
import Notification from "../general/Notification"

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

const user = (state = {brands: []}, action) => {
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
        case "SET_USER" :
            console.log('setTing user')
            var u = action.update
            
            return {
                logged_in: true,
                ...state,
                ...action.update,
                brands: action.update.brands ? [...action.update.brands] : [],
                styles: action.update.styles ? [...action.update.styles] : []
                
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

const notify = (state={show: false}, action) => {
    switch (action.type) {
        case "NOTIFY":
            console.log('notifying')
            return {
                show: true,
                content: action.content
            }
        case "HIDE_NOTIFY":
            return {
                show: false,
                content: null
            }
        default:
            return state
    }
}

const reducer = combineReducers({
    modal,
    slideUp,
    user,
    sideNav,
    notify
})

const store = createStore(reducer)

window.endpoint_prefix = 'user'

const AppRoutes = () => {
    makeGetRequest('user-info',
        (user) => {
            user = user.body
            user = JSON.parse(user)
            console.log('got user info')
            console.log(user)
            store.dispatch({type: 'SET_USER', user})
        }
    )
    return (
        <React.Fragment>
            <Route path="/app" exact render={() => <Redirect to="/app/home" />} />
            <Route path="/app/home" exact component={Home} />
        </React.Fragment>
    )
}

const AppContent = () => {
    return (
        <React.Fragment>
            <Provider store={store}>
                <div className="body" style={{height: '100vh'}}>

                <AppRoutes />
                </div>
                <Notification />
                <SideNav />
                <Modal />
            </Provider>
        </React.Fragment>
    )
}

export default AppContent
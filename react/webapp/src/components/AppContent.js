import React from "react"
import { Route, Redirect } from "react-router-dom"
import Navbar from "../general/Navbar"
import SideNav from "../general/SideNav"
import Home from "./Home";
import Help from "../landingComponents/Help"
import Modal from "../general/Modal"
import { combineReducers, createStore } from "redux"
import { Provider } from "react-redux"
import { makeGetRequest } from "../api_calls";
import SlideUpPanel from "../general/SlideUpPanel";

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

const reducer = combineReducers({
    modal,
    slideUp,
    user,
    sideNav
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
            <Route path="/app" exact render={() => <Redirect to="/app/profile" />} />
            <Route path="/app/home" exact component={Home} />
            <Route path="/app/profile/brands" exact render={() => {return (
                <>
                <Navbar back={true} />
                </>
            )}} />
            <Route path="/app/profile/swipe" exact render={() => {return (
                <>
                <Navbar back={true} />
                <div className="body" style={{backgroundColor: '#89C497'}}>f
                </div>
                </>
            )}} />
            <Route path="/app/help" exact component={Help} />
            <Route path="/app/profile/new_request" exact render={() => {return (
                <>
                <Navbar back={true} />
                <div className="body" style={{backgroundColor: '#EA653C'}}>
                    <div className="panel">
                        <div className="form-container">
                        </div>
                    </div>
                </div>
                </>
            )}} 
            />
        </React.Fragment>
    )
}

const AppContent = () => {
    console.log('getting dets')
    makeGetRequest('user/details',
        (update) => {
            update = update.body
            console.log(update)
            update = JSON.parse(update)
            console.log('got update info')
            console.log(update)
            store.dispatch({type: 'SET_USER', update})
        }
    )
    return (
        <React.Fragment>
            <Provider store={store}>
                <AppRoutes />
                <SideNav />
                {/* <Tabs /> */}
                <Modal />
            </Provider>
        </React.Fragment>
    )
}

export default AppContent
import React from "react"
import { Route } from "react-router-dom"
import AdminNavbar from "./Navbar"
import SideNav from "../components/SideNav"
import AdminRoot from "./AdminRoot"
import arrow from "../images/icons/arrow.png"
import { AdminProtectedRoute } from "../CustomRoutes"
import { Provider } from "react-redux"
import { combineReducers, createStore } from "redux"
import { makeGetRequest } from "../api_calls"
import Modal from "../components/Modal"
import SlideUpPanel from "../components/SlideUpPanel"


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

const AdminRoutes = (props) => {
    return (
        <React.Fragment>
            <Route path ="/5015db37-0d03-4f44-93a5-606ac215935b/admin" exact component={AdminRoot} />    
        </React.Fragment>
    )
}

const AdminContent = () => {
    return (
        <React.Fragment>
            <Provider store={store}>
                <AdminRoutes />
                <SideNav />
                <Modal />
                <SlideUpPanel />
            </Provider>
        </React.Fragment>
    )
}

export default AdminContent
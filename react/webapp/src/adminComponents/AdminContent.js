import React from "react"
import { Route } from "react-router-dom"
import AdminNavbar from "./Navbar"
import SideNav from "../components/SideNav"
import AdminRoot from "./AdminRoot"
import ServeUsers from "./ServeUsers"
import ServeRequest from "./ServeRequest"
import SignUpUsers from "./SignUpUsers"
import Segments from "./Segments"
import AllUsers from "./AllUsers"
import User from "./User"
import arrow from "../images/icons/arrow.png"
import UpdateBrands from "./UpdateBrands"
import Messages from "./Messages"
import Stylists from "./Stylists"
import { AdminProtectedRoute } from "../CustomRoutes"
import { Provider } from "react-redux"
import { combineReducers, createStore } from "redux"
import { makeGetRequest } from "../api_calls"
import Modal from "../components/Modal"
import SlideUpPanel from "../components/SlideUpPanel"
import Broadcast from "../adminComponents/Broadcast"
import Orders from "./Orders"

const stylists = (state=[], action) => {
    switch (action.type) {
        case "SET_STYLISTS":
            return action.stylists
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
    stylists,
    modal,
    slideUp,
    user,
    sideNav
})

const store = createStore(reducer)

const AdminRoutes = (props) => {

    //  WHY DOES THIS NOT WORK OUTSIDE OF THIS COMPONENT? ERROR IS 'NO USER POOL' 
    makeGetRequest('admin-stylists', 
        (data) => {
            data = data.body
            data = JSON.parse(data)
            console.log(data)
            store.dispatch({type: 'SET_STYLISTS', stylists: data})
        }
    )

    return (
        <React.Fragment>
            <Route path ="/5015db37-0d03-4f44-93a5-606ac215935b/admin" exact component={AdminRoot} />
            {/* <Route path ="/5015db37-0d03-4f44-93a5-606ac215935b/admin/serve_users" exact component={ServeUsers} /> */}
            {/* <Route path ="/5015db37-0d03-4f44-93a5-606ac215935b/admin/serve_users/request" component={ServeRequest} /> */}
            {/* <Route path ="/5015db37-0d03-4f44-93a5-606ac215935b/admin/sign_up_users" exact component={SignUpUsers} /> */}
            {/* <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/add_to_segments`} component={Segments}/> */}
            <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/all_users`} exact component={AllUsers}/>
            <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/user`} component={User}/>
            <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/update_brands`} component={UpdateBrands}/>
            <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/messages`} component={Messages}/>
            {/* <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/messaging`} render={() => {return <div className="body"><Messaging /></div>}}/> */}
            <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/stylists`} component={Stylists}/>
            <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/stylist_broadcast`} component={Broadcast}/>
            <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders`}  component={Orders}/>
            {/* <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders`} component={Orders}/> */}
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
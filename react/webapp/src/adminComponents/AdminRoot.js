import React, { Component } from "react"
import Section from "../components/Section"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Navbar from "../components/Navbar"

export default class AdminRoot extends Component {
    constructor(props) {
        super(props)
        this.path = this.props.match.path
        console.log('PATH:', this.path)
    }
    render() {
        return (
            <>
            <Navbar />
            <div className="body" style={{backgroundColor: 'var(--lilac)'}}>
                <div className="large page-title">
                    Admin
                </div>
                {/* <Section to={`${this.path}/serve_users`} title={'Serve requests'}/> */}
                {/* <Section to={`${this.path}/sign_up_users`} title='Sign up users manually' /> */}
                {/* <Section to={`${this.path}/add_to_segments`} title='Add images to segments' /> */}
                <Section to={`${this.path}/all_users`} title='See all users' />
                {/* <Section to={`${this.path}/add_products`} title='Add products' /> */}
                {/* <Section to={`${this.path}/label_products`} title='Label products' /> */}
                {/* <Section to={`${this.path}/update_brands`} title='Update brands' /> */}
                <Section to={`${this.path}/stylists`} title='Manage stylists' />
                <Section to={`${this.path}/stylist_broadcast`} title='Broadcast to stylists' />
                <Section to={`${this.path}/orders`} title='Orders' />
                {/* <Section to={`${this.path}/messages`} title='Message users' /> */}
            </div>
            </>
        )
    }
}
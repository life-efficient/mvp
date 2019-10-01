import React, { Component } from "react"  
import { Link } from "react-router-dom"
import "./Tabs.css"
import fire from "../images/icons/fire.png"
import home from "../images/icons/home.png"
import top from "../images/icons/top.png"
import { connect } from "react-redux"

class Tab extends Component {

    getTabStyle = () => {
        var o = window.location.href.includes(this.props.href) ? 1 : 0.2
        return {
            opacity: o
        }
    }

    render() {
        return (
            <Link to ={`${this.props.href}`} style={this.getTabStyle()} onClick={() => {this.props.activate(this.props.href)}}>
                {/* <div>
                    <img src={this.props.icon} className='tab-icon' alt="" />
                </div> */}
                <div className="tab-title">
                    {this.props.title}
                </div>
            </Link>
        )
    }
}


class Tabs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            active_tab: window.location.href.split('/')[3]
        }
    }

    activateTab = (tab_href) => {
        console.log(tab_href)
        this.setState({active_tab: tab_href})
    }

    render () {
        return (
            <div className="tabs" style={this.props.top ? {bottom: '0'} : null}>
                {/*
                <Tab icon={home} title="home" href="/app/home" activate={this.activateTab} active={this.state.active_tab} />
                <Tab icon={top} title="Get clothes" href="/app/new_request" activate={this.activateTab} active={this.state.active_tab} />
                */}
                {/* // <Tab icon={top} title="clothes" href="/app/recommendations" activate={this.activateTab} active={this.state.active_tab}/> */}
                {
                    this.props.tabs.map(
                        (tab, idx) => {
                            return <Tab icon={tab.icon} title={tab.name} href={tab.to} activate={this.activateTab} active={this.state.active_tab}/>
                        }
                    )
                }
            </div>
        )
    }
}

export default Tabs
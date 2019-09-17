import React, { Component } from "react"
import { makeGetRequest, makePostRequest } from "../api_calls"
import queryString from "query-string"
import SlideUpPanel from "../components/SlideUpPanel"
import { connect } from "react-redux"
import UserInfo from "./UserInfo"
import AddRecItem from "../adminComponents/MakeRecommendations"
import { withRouter } from "react-router-dom"
import Navbar from "./Navbar"
import Messaging from "./Messaging";
import BrandSearch from "./BrandSearch"
import PotentialRecommendation from "./PotentialRecommendation"
import ProductSearch from "./ProductSearch"

class Client extends Component {
    constructor(props){
        super(props)
        var params = queryString.parse(this.props.location.search)
        this.state = {
            user_id: params.sub,
            user: this.props.location.state,
            recommended: []
        }
        console.log('clients mounted')
        console.log('PROPS:', props)
        this.getRecommended()
    }

    getRecommended = () => {
        console.log('getting recommended')
        return new Promise((resolve, reject) => {
            console.log('making rel')
            makeGetRequest(`stylist-user-recs-in-rec-buffer?sub=${this.state.user_id}`,
                (data) => {
                    this.setState({recommended: data})
                    console.log('ALREADY RECOMMENDED:', data)
                    // this.setState({already_recommended: data})
                    resolve(data)
                }
            )
        })
    }

    render () {
        return (
            <>
            <Navbar back={true} />
            <div style={{backgroundColor: '#BCA2F2'}}>
                <div className="large">
                    {this.props.location.state.name}
                </div>
                <UserInfo user={this.props.location.state}/>
                {
                    this.state.recommended.length > 0 ?
                    <div className="panel">
                        <div className="medium">
                            Already recommended and waiting to be sent
                        </div>
                        <div className="liked-imgs">
                            {this.state.recommended.map(
                                (rec) => {
                                    return <img src={rec.img_urls[0]} className="liked-img"/>
                                }
                            )}
                        </div>
                    </div>
                    :
                    null
                }
                <Messaging />
                <div className="panel">
                    <div className="btn small" onClick={() => this.props.openModal(<AddRecItem getRecommended={this.getRecommended} closeModal={this.props.closeModal} />)} style={{backgroundColor: 'var(--green)', width: '300px;'}}>
                        New recommendation
                    </div>
                    <div className="small">
                        Recommend an item you've found somewhere!
                    </div>
                    <div className="small">
                        We are currently really struggling to get products to users fast enough. 
                        <br/>
                        If we don't manage to improve this, we might not be able to raise money in 2 weeks, and keep the company alive. 
                        <br/>
                        So we need your help!... Please try to recommend from: 
                        <br/>
                        <br/>
                        <div onClick={() => {window.open(`https://petalsandpeacocks.com/`)}} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                            Petals and peacocks    
                        </div>
                        <br/>
                        <div onClick={() => {window.open(`https://us.asos.com/women/`)}} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                            Asos
                        </div>
                        <br/>
                        <div onClick={() => {window.open(`https://www.brandymelvilleusa.com/`)}} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                            Brandy Melville
                        </div>
                        <br/>
                        <div onClick={() => {window.open(`https://www.zara.com/us/`)}} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                            Zara
                        </div>
                        <br/>
                        <div onClick={() => {window.open(`https://www.madewell.com/`)}} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                            Madewell
                        </div>
                        <br/>
                    </div>
                </div>
                <ProductSearch user={this.state.user}/>
                <BrandSearch getRecommended={this.getRecommended} />
                <SlideUpPanel />
            </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openModal: (content) => {
            console.log('content:', content)
            dispatch({
                type: "OPEN_MODAL",
                content: content
            })
        },
        closeModal: () => {
            dispatch({
                type: "CLOSE_MODAL"
            })
        },
        closeSlideUp: () => {
            dispatch({
                type: "CLOSE_SLIDEUP"
            })
        }
    }
}

export default withRouter(connect(null, mapDispatchToProps, null, {pure: false})(Client))
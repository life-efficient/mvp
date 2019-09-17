import React, { Component } from "react"
import Navbar from "./Navbar"
import add from "../images/icons/plus.svg"
import "./Collections.css"
import { connect } from "react-redux"

class Collections extends Component {
    render() {
        return (
            <>
                <Navbar back={true} />
                <div className="body" style={{backgroundColor: 'var(--pink)'}} >
                    <div className="medium">
                        Your style collections
                    </div>
                    <div className="small">
                        Save and organise collections however you want
                    </div>
                    <div className="collections">
                        {
                            this.props.collections ? 
                            this.props.collections.map(
                                (c) => {
                                    return <CollectionThumb collection={c} />
                                }
                            )
                            :
                            null
                        }
                        <AddCollection openSlideUp={this.props.openSlideUp}/>
                    </div>
                </div>
            </>
        )
    }
}

const CollectionThumb = (props) => {
    return (
        <div className="collection-thumb">
            <div className="collection-thumb-title">
                {props.title}
            </div>
            <img src={props.thumb} />
        </div>
    )
}

class Collection extends Component{

    addToCollection = () => {
        return null
    }

    render() {
        return (
            <div className="collection">
                {this.props.collection.items.map(
                    (item) => {
                        return <img src={item.url} />
                    }
                )}
            </div>
        )
    }
}

const AddCollection = (props) => {
    return (
        <div className="collection-thumb" style={{cursor: 'pointer'}} onClick={() => {props.openSlideUp(<Collection />)}}>
            <div className="collection-thumb-title">
                New collection 
            </div>
            <img src={add} />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        collections: state.collections
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openSlideUp: (content) => {
            dispatch({
                type: "OPEN_SLIDEUP",
                content: content
            })
        }
    }
}

export default Collections = connect(mapStateToProps, mapDispatchToProps)(Collections)
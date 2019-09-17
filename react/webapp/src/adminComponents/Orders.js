import React, { Component } from "react"
import { makeGetRequest, makePostRequest } from "../api_calls";
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import Navbar from "./Navbar"
import Section from "../components/Section"
import "./Orders.css"
import Loading from "../general/Loading";
import Tabs from "../general/Tabs"
import box from "../images/icons/box.png"
import upArrow from "../images/icons/upArrow.png"
import downArrow from "../images/icons/downArrow.png"
import writing from "../images/icons/writing.png"
import delivery from "../images/icons/delivery.png"

import { Route } from "react-router-dom"
import Dropdown from "../general/form_components/Dropdown";

class Group extends Component {

    render() {
        return(
            <>
                <div className="medium">
                    {this.props.title}
                </div>
                {
                    this.props.items ?
                    this.props.items
                    :
                    <Loading />
                }
            </>
        )
    }
}

class ItemGroups extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: null,
            arriving: null,
            boxes: null,
            deliveries: null,
            returns: null,
            // other: null,
            // active: 'orders'
        }
        this.getOrders()
    }

    getOrders = () => {
        makeGetRequest('admin-orders',
            (products) => {
                products = JSON.parse(products.body)

                console.log('ORDERS:', products)
                products = products.map(
                    (p) => {
                        var brand = p.brand
                        brand = brand.toLowerCase()
                        brand = brand.replace('_', ' ')
                        p.brand = brand
                        return p
                    }
                )

                this.statuses = ['needs ordering', 'ordered', 'arrived', 'needs delivering', 'delivered', 'needs picking up', 'needs returning']

                var orders = products.filter(
                    (p) => {
                        if (p.name == 'Test') {
                            console.log('GOT TEST')
                        } 
                        return p.status == 'needs ordering'
                    }
                )

                var arriving = products.filter(
                    (p) => {
                        return p.status == 'ordered'
                    }
                )

                var boxes = products.filter(
                    (p) => {
                        return p.status == 'arrived'
                    }
                )

                var deliveries = products.filter(
                    (p) => {
                        return p.status == 'needs delivering' || p.status == 'delivered' || p.status == 'needs picking up'
                    }
                )

                var returns = products.filter(
                    (p) => {
                        return p.status == 'needs returning'
                    }
                )

                var other = products.filter(
                    (p) => {
                        return ![...orders, ...arriving, ...boxes, ...returns].includes(p)
                    }
                )

                console.log('DELIVERIES:', deliveries)

                this.setState({
                    orders,
                    arriving,
                    boxes,
                    deliveries,
                    returns,
                    // other
                })
            }
        )
    }

    reduceItemsToGroups = (stage, items) => {
        switch (stage) {
            case "orders":
            case "returns":
            case "arriving":
                // reduce items into their respective brands
                var site
                var siteList
                var sites = items.reduce(        // reduce list of all orders into dict of products from particular sites
                    (siteMap, item) => {
                        // console.log(siteMap)
                        site = item.url ? item.url : item.product_url
                        site = site.split('/')[2]//.replace('www.', '')
                        // console.log(site)
                        siteList = siteMap[site] ? siteMap[site] : []
                        siteList.push(item)
                        siteMap[site] = siteList
                        return siteMap
                    },
                    {}
                )
                return sites
            case "boxes":
            case "deliveries":
                // reduce items into boxes
                var user
                var userList
                var users = items.reduce(
                    (userMap, item) => {
                        user = item.user_id
                        userList = userMap[user] ? userMap[user] : []
                        userList.push(item)
                        userMap[user] = userList
                        return userMap
                    }
                    ,
                    {}
                )
                return users
        }
    }

    formatToSection = (name, groups) => {
        var ordered = {}
        var dates = []
        // console.log(name, groups)
        Object.keys(groups).sort(        // sort stores by oldest date
            (s1, s2) => {
                console.log('site 1:', s1)
                var s1_date =new Date(Math.min.apply(null, groups[s1].map((o) => new Date(o.timestamp))));
                var s2_date =new Date(Math.min.apply(null, groups[s2].map((o) => new Date(o.timestamp))));
                var diff = s1_date - s2_date
                console.log(diff)
                return diff
            }
        )
        .forEach(                       // list oldest date of each item in this group
            (key) => {
                ordered[key] = groups[key]
                var time_ago = new Date() - new Date(Math.min.apply(null, groups[key].map((o) => new Date(o.timestamp))))
                console.log(time_ago)
                var days_ago = Math.round(time_ago / (1000 * 24 * 60 * 60)) 
                dates.push(days_ago)
            }
        )
        // console.log(ordered)
        switch(name) {
            case "orders":  // Fallthrough  (do same code for orders and returns)
            case "arriving":
            case "returns":
                return Object.keys(ordered)
                .map(                               // map 
                    (key, idx) => {
                        var orders = groups[key]
                        // console.log(dates[idx])
                        return (
                            <>
                                <div className="orders-brand section" passthrough={orders} title={key} caption={`${orders.length} items`} 
                                    onClick={() => {this.props.openSlideUp(
                                        // slideup content
                                        <>
                                            <div className="medium">
                                                Products from {key}
                                            </div>
                                            {
                                                orders.map(
                                                    (order) => {
                                                        console.log('ORDER:', order)
                                                        return (
                                                            <SlideUpItem type={name} order={order} />
                                                        )
                                                    }
                                                )
                                            }
                                        </>
                                    )}}>
                                        <div className="medium" >{key}</div>
                                        <div className="small">
                                            {orders.length} {orders.length == 1 ? 'item' : 'items'}
                                        </div>
                                        <div className="small">
                                            Ordered {dates[idx].toString()} days ago
                                        </div>
                                </div>
                            </>
                        )
                    }
                )
            case "boxes":
                 return Object.keys(ordered)
                 .map(
                     (key, idx) => {
                        var orders = groups[key]
                        var total_num_orders = [...this.state.orders, ...this.state.arriving, ...this.state.boxes].filter((o) => {return o.user_id == key}).length
                        return (
                            <BoxGroup name={groups[key][0].name} instagram={groups[key][0].instagram} all_products={orders} oldest_date={dates[idx]} openSlideUp={this.props.openSlideUp} total_num_orders={total_num_orders} />
                        )
                     }
                 )
            case "deliveries":
                var needs_delivering
                var delivered
                var needs_picking_up
                return Object.keys(ordered)
                .map(
                    (key, idx) => {
                        var deliveries = groups[key]
                        return (
                            <DeliveryGroup name={groups[key][0].name} instagram={groups[key][0].instagram} all_products={deliveries} oldest_date={dates[idx]} openSlideUp={this.props.openSlideUp} openModal={this.props.openModal}  />
                        )
                    }
                )
            
        }
    }

    render() {
        return (
            <>  
                {
                    window.location.pathname == '/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders' ?
                    <Redirect to='/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/orders' />
                    :
                    null
                }
                <Navbar back={true} back_to="/5015db37-0d03-4f44-93a5-606ac215935b/admin" />
                <div className="body" style={{backgroundColor: 'var(--green)', marginBottom: '8vh'}}>
                    {
                        Object.keys(this.state).map(
                            (stage) => {
                                console.log('title:', stage)
                                console.log(this.state[stage])
                                return <Route path={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/${stage}`} render={() =>{return <Group title={stage} items={ this.state[stage] ? this.formatToSection(stage, this.reduceItemsToGroups(stage, this.state[stage])) : null} />}} />
                            }
                        )
                    }
                    {/* <Route path="/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/boxes" render={() =>{return <Group title='Boxes' items={ this.state.boxes ? this.formatToSection('boxes', this.reduceItemsToUser(this.state.boxes)) : null} openSlideUp={this.props.openSlideUp} />}} />
                    <Route path="/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/returns" render={() =>{return <Group title='Returns' items={ this.state.returns ? this.formatToSection('returns', this.reduceItemsToSites(this.state.returns)) : null} openSlideUp={this.props.openSlideUp} />}} /> */}
                </div>
                <Tabs 
                    tabs={[
                        {
                            name: 'orders',
                            icon: downArrow,
                            to: '/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/orders'
                        },
                        {
                            name: 'arriving',
                            icon: writing,
                            to: '/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/arriving'
                        },
                        {
                            name: 'boxes',
                            icon: box,
                            to: '/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/boxes'
                        },
                        {
                            name: 'deliveries',
                            icon: delivery,
                            to: '/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/deliveries'
                        },
                        {
                            name: 'returns',
                            icon: upArrow,
                            to: '/5015db37-0d03-4f44-93a5-606ac215935b/admin/orders/returns'
                        }
                    ]}
                />
            </>
        )
    }
}

class SlideUpItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: null,
            loading: false
        }
        this.map = {
            "orders": {
                action: "ordered",
                prev_action: "needs ordering"
            },
            "arriving": {
                action: "arrived",
                prev_action: "ordered"
            },
            "boxes": {
                action: "needs delivering",
                prev_action: "arrived"
            },
            "deliveries": {
                action: "delivered",
                prev_action: "needs delivering"
            },
            "returns": {
                action: "returned",
                prev_action: "needs returning"
            }
        }
    }

    update = (e) => {
        if (this.state.status) {
            return null
        }
        this.setState({loading: true})
        var action = this.map[this.props.type].action
        console.log('updating status to:', action)
        // console.log(this.state)
        if (this.props.order.status != this.map[this.props.type].prev_action) {     // must have the previous action in the process
            return null
        }
        makePostRequest('update-recommendation', {...this.props.order, action},
            () => {
                console.log('item ordered')
                this.setState({
                    status: 'Nice work!',
                    loading: false
                })
            }
        )
    }

    getContent = () => {
        var order = this.props.order
        switch (this.props.type) {
            case "orders":
                return (
                    <>
                        <div>
                            Should cost less than {order.currency}{order.price}
                        </div>
                        <button className="btn" onClick={this.update} style={{backgroundColor: 'var(--red)'}}>
                            {
                                this.state.loading ?
                                <Loading />
                                :
                                this.state.status ?
                                this.state.status
                                :
                                "It's ordered"
                            }
                        </button>
                    </>
                )
            case "arriving":
                return (
                    <>
                        <button className="btn" onClick={this.update} style={{backgroundColor: 'var(--red)'}}>
                            {
                                this.state.loading ?
                                <Loading />
                                :
                                this.state.status ?
                                this.state.status
                                :
                                "It's arrived!"
                            }
                        </button>
                    </>
                )
            case "returns":
                return (
                    <>
                        <button className="btn" onClick={this.update} style={{backgroundColor: 'var(--red)'}}>
                            {
                                this.state.loading ?
                                <Loading />
                                :
                                this.state.status ?
                                this.state.status
                                :
                                "It's been returned!"
                            }
                        </button>
                    </>
                )
            case "boxes":
            case "delivery":
                return null
        }
    }

    render() {
        var order = this.props.order
        var link = this.props.order.product_url ? this.props.order.product_url : this.props.order.url
        console.log('ORDERS:', order)
        return (
            <div className="order-item">
                <img src={order.img_urls[0]} />
                <div className="small order-content">
                    <div className="medium">
                        {order.name}
                    </div>
                    <div onClick={() => {window.open(`/5015db37-0d03-4f44-93a5-606ac215935b/admin/user?sub=${order.user_id}`)}} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                        See user details
                    </div>
                    <div onClick={() => {window.open(link)}} style={{cursor: 'pointer'}}>                           {/* link to product */}
                        {link}
                    </div>
                    <div>
                        Ordered on: {order.timestamp}
                    </div>
                    {this.getContent()}
                </div>
            </div>
        )
    
    }
}


class BoxGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }

    }

    updateAll = (e) => {
        e.stopPropagation()
        this.setState({loading: true})
        var action = 'needs delivering'
        this.props.all_products.map(
            (p, idx) => {
                console.log('updating status to:', action)
                // console.log(this.state)
                if (p.status != 'arrived') {     // must have the previous action in the process
                    alert(`product ${idx} has not arrived`)
                    return null
                }
                makePostRequest('update-recommendation', {...p, action},
                    () => {
                        console.log('item status set to needs delivering')
                        this.setState({
                            status: "Great work",
                            loading: false
                        })
                    }
                )
            }
        )
    }

    render(){
        var orders = this.props.all_products
        return (
            <>
                <div className="orders-brand section"  
                    onClick={() => {this.props.openSlideUp(
                        // slideup content
                        <>
                            <div className="medium">
                                Box for {this.props.name}
                            </div>
                            <div className="small">({this.props.instagram})</div>
                            {
                                orders.map(
                                    (order) => {
                                        console.log('ORDER:', order)
                                        return (
                                            <SlideUpItem type={'boxes'} order={order} />
                                        )
                                    }
                                )
                            }
                        </>
                    )}}>
                        <div className="medium" >{orders[0].name}</div>
                        <div className="small">({this.props.instagram})</div>
                        <div className="small">
                            {orders.length} {orders.length == 1 ? 'item' : 'items'}
                        </div>
                        <div className="small">
                            Ordered {this.props.oldest_date.toString()} days ago
                        </div>
                        <div className="small">
                            {this.props.all_products.length}
                            /
                            {this.props.total_num_orders} ordered items currently in box
                        </div>
                        <button className="btn" onClick={this.updateAll} style={{backgroundColor: 'var(--red)', marginLeft: '10px'}}>
                            {
                                this.state.loading ?
                                <Loading />
                                :
                                this.state.status ?
                                this.state.status
                                :
                                "Set for delivery!"
                            }
                        </button>
                </div>
            </>

        )
    }
}

class DeliveryGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            delivery_date: null,
            delivery_time: null
        }
    }

    updateAll = (e) => {
        e.stopPropagation()
        this.setState({loading: true})
        var action = ''
        console.log(this.props.all_products)
        // this.props.all_products.map(
        //     (p, idx) => {
        //         console.log(p)
        //         console.log('updating status to:', action)
        //         // console.log(this.state)
        //         if (p.status != 'needs delivering') {     // must have the previous action in the process
        //             alert(`product ${idx} has not arrived`)
        //             return null
        //         }
        //         makePostRequest('update-recommendation', {...p, action},
        //             () => {
        //                 console.log('item status set to needs delivering')
        //                 this.setState({
        //                     status: "Great work",
        //                     loading: false
        //                 })
        //             }
        //         )
        //     }
        // )
    }

    getCaption = () => {
        switch("needs delivering") {
            case "needs delivering":
                return 'yo caption'
        }
    }

    handleOptionChange = (e) => {
        this.setState({[e.target.name]: e.target.value},
            () => {
                console.log(this.state)
            }
        )
    }

    getDeliveryForm = () => {
        return (
            <div className="form-container">
                <div className="field-container">
                    <div className="field-title">
                        Date
                    </div>
                    <Dropdown options={[...Array(31).keys()].map((i)=>{return i+1})} prompt="select date" value={this.state.delivery_date} onChange={this.handleOptionChange} name="delivery_date" />
                </div>
                <div className="field-container">
                    <div className="field-title">
                        Time
                    </div>
                    <Dropdown options={[...[...Array(12).keys()].map((i)=>{return (i+8<10 ? '0' : '') + (i+8) + '00'})]} prompt="select time" value={this.state.delivery_time} onChange={this.handleOptionChange} name="delivery_time" />
                </div>
                <button onClick={this.updateAll}>Set for delivery!</button>
            </div>
        )
    }

    render() {
        var orders = this.props.all_products
        return (
            <>
                <div className="orders-brand section" passthrough={orders} caption={`${orders.length} items`} 
                    onClick={() => {this.props.openSlideUp(
                        // slideup content
                        <>
                            <div className="medium">
                                Box for {this.props.name} ({this.props.instagram})
                            </div>
                            {
                                orders.map(
                                    (order) => {
                                        console.log('ORDER:', order)
                                        return (
                                            <SlideUpItem type={'boxes'} order={order} />
                                        )
                                    }
                                )
                            }
                        </>
                    )}}>
                        <div className="medium" >{orders[0].name}</div>
                        <div className="small">({this.props.instagram})</div>
                        <div className="small">
                            {orders.length} {orders.length == 1 ? 'item' : 'items'}
                        </div>
                        <div className="small">
                            Ordered {this.props.oldest_date.toString()} days ago
                        </div>
                        <button className="btn" onClick={(e) => {e.stopPropagation(); this.props.openModal(this.getDeliveryForm())}} style={{backgroundColor: 'var(--red)', marginLeft: '10px'}}>
                            {
                                this.state.loading ?
                                <Loading />
                                :
                                this.state.status ?
                                this.state.status
                                :
                                "Mark as delivered!"
                            }
                        </button>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openSlideUp: (content) => {
            dispatch({
                type: "OPEN_SLIDEUP",
                content
            })
        },
        openModal: (content) => {
            dispatch({
                type: "OPEN_MODAL",
                content
            })
        },
        closeModal: () => {
            dispatch({
                type: "CLOSE_MODAL"
            })
        }
    }
} 

export default ItemGroups = connect(null, mapDispatchToProps)(ItemGroups)
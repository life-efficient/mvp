import React, { Component } from "react"
import Dropdown from "../general/form_components/Dropdown"
import gradient from "../images/gradient.png"
import "./MakeRecommendations.css"
import { connect } from "react-redux";
import { Auth, Storage, JS } from "aws-amplify"
import uuid from "uuid"
import queryString from "query-string"
import { makeGetRequest, makePostRequest } from "../api_calls"
import Loading from "../general/Loading"
// import bad_img from "../images/misc/bad_img.jpg"
// import good_img from "../images/misc/good_img.jpg"
// import Style from "../components/Style";
import sendIcon from "../images/icons/send.svg"

export class AddRecItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item: {
                img_urls: [],
                url: '',
                brand: '',
                price: '',
                currency: null,
                tags: [],
                action: 'recommend',
                caption: '',
                product_type: []
            },
            allStyles: window.styles,
            allTypes: [
                't-shirt',
                'top',
                'jeans',
                'pants',
                'swimwear',
                'jacket',
                'shoes',
                'dress',
                'skirt',
                'tracksuit',
                'shirt',
                'hoody',
                'sweater',
                'skort',
                'bag',
                'blouse'
            ].sort(),
            request: '',
            img_files: [],
            img_previews : [],
            page: 1,
            loading: false
        }
    }

    handleTextChange = (e) => {
        console.log('event target:', e.target)
        var val = (e.target.id == 'tags') ? 
            e.target.value.split(/,\s*/) : 
            e.target.value
        val = (e.target.id == 'price') ?
            val = val.replace(/[^0-9.]/, '')
            // val = val.match(/^\d+(\.\d{1,2})?$/)
            :
            val
        this.setState({
            item: {
                ...this.state.item,
                [e.target.id]: val
            }
        }, 
        () => {
            console.log('item:', this.state.item)
        }
        )
    }

    handleOptionChange = (event) => {
        this.setState({
            item: {
                ...this.state.item,
                [event.target.name]: event.target.value
            }
        },
        () => {
            console.log('setting currency:', this.state)
        }
        )
    }

    handleArrayOptionChange = (e) => {
        console.log('TARGET:', e.target)
        var options = this.state.item[e.target.name]
        if (options.includes(e.target.id)) {
            console.log('removing style')
            options = options.filter( (item) => {return item != e.target.id} )
        }
        else {
            console.log('addign style')
            options.push(e.target.id)
        }
        this.setState({item: {...this.state.item, [e.target.name]: options}},
            console.log('array:', this.state.item[e.target.name])
        )
    }

    handleRequestChange = (e) => {
        this.setState({request: e.target.value},
            () => {console.log(this.state)}    
        )
    }

    submitRequest = () => {
        var request = this.state.request.toLowerCase()
        if (request != '') {
            var key = this.state.page == 6 ? 'allTypes' : 'allStyles'
            if (! this.state[key].includes(request)) {        // if requested key not in list of all keys
                this.setState({
                    [key]: [...this.state[key], request],
                })
                makePostRequest('feature-request', {type: 'new tag request', request: request}) // alert me
            }
            this.setState({
                request: ''
            })
            this.handleArrayOptionChange({target: {id: request, name: this.state.page == 6 ? 'product_type' : 'tags'}})
        }
    }

    getImgs = () => {
        console.log('getting imgs')
        console.log('prevs srcs:', this.state.img_previews)
        var img_prevs = this.state.img_previews.map(
            (img) => {
                return <img src={img} alt="" className="rec-img-thumb"/>
            }
        )
        console.log('IMG PREVIEWS:', img_prevs)
        return img_prevs
    }

    setImgs = (e) => {
        console.log('setting imgs')
        if (e.target.files[e.target.files.length - 1].type.split('/')[1] == 'webp') {
            alert('Please do not use images with a ".webp" file extension. Use ".JPG" or ".png" images :)')
            return null
        }

        this.setState({img_files: e.target.files},
            () => {console.log('set img files:', this.state.img_files)}    
        )
        for(var x = 0, xlen = e.target.files.length; x < xlen; x++) {
            var file = e.target.files[x];
            if(file.type.indexOf('image') != -1) { // Very primitive "validation"
                var reader = new FileReader();
                reader.onload = function(i) {
                    var img_src = i.target.result;
                    console.log('img:', img_src)
                    this.setState({
                        img_previews: [...this.state.img_previews, img_src]
                    },
                        () => console.log('set img previews:', this.state.img_previews)
                    )
                }.bind(this)
                reader.readAsDataURL(file);
            }
        }
    }

    next = () => {
        this.setState({page: this.state.page + 1})
    }

    previous = () => {
        this.setState({page: this.state.page - 1})
    }

    saveFiles = (files) => {
        return new Promise(
            (resolve, reject) => {
                var type
                var url
                var fp
                for (var i=0; i<files.length; i++) {
                    type = files[i].type.split('/')[1]
                    fp = `recommended_items/${uuid.v4()}.${type}`
                    var mimeType 
                    if (type == 'png') {
                        mimeType = 'image/png'
                    }
                    else if (type == 'jpg' || type == 'jpeg') {
                        mimeType = 'image/jpeg'
                    }
                    else {
                        alert('image type invalid (use .PNG, .JPG or .JPEG images)\nYou used type ' + type)
                        return null
                    }
                    console.log('puttin')
                    Storage.put(fp, files[i], {contentType: mimeType})
                    .then(
                        () => {
                            url =`https://s3-eu-west-1.amazonaws.com/adla-data/public/${fp}`
                            this.setState({
                                item: {
                                    ...this.state.item,
                                    img_urls: [...this.state.item.img_urls, url]
                                }
                            }, 
                                () => {
                                    if (this.state.item.img_urls.length == files.length) {
                                        resolve()
                                    }
                                }
                            )
                        }
                    )
                    .catch((err) => {alert('ERROR:', err)})
                    //.catch(reject(Error('The following file failed to upload:', files[i])))
                }
            }
        )
    }
    
    recommendItem = () => {
        this.setState({loading: true})
        console.log('adding image')
        var files = this.state.img_files
        console.log('files:', files)
        this.saveFiles(files)
        .then(
            url => {
                console.log('now posting request')
                var loc = window.location.search
                var params = queryString.parse(loc)
                var sub = params.sub
                var req_id = params.req_id

                // var endpoint = `update-recommendation?sub=${sub}&req_id=${req_id}`
                var endpoint = `update-recommendation?sub=${sub}`
                var body = this.state.item
                for (var i in body) { 
                    console.log(i)
                    if (body[i] === null || body[i] === undefined || body[i].length === 0) {
                        console.log('removing:', i)
                        delete body[i]
                    }
                }

                var rec = {...body, user_id: sub}
                delete rec['action']
                body = {recs: [rec], action: 'recommend'}
                
                /*.filter((key, index) => {
                    return body[key] != ''
                });
                */
                console.log(body)
                makePostRequest(endpoint, body,
                    (data) => {
                        console.log('done adding item to recommendations')
                        data.json()
                        .then(
                            (data) => {
                                console.log(data)
                                // this.props.onRecommend()
                                this.setState({loading: false})
                                this.props.closeModal()
                                this.props.getRecommended()
                                .then(
                                    (recs) => {
                                        var prompts = [
                                            'Nice work!',
                                            'Rec made!',
                                            'Great work!',
                                            'That\'s it!',
                                            'Success!',
                                            'Done'
                                        ]
                                        var num_left = 5 - recs.length
                                        var update
                                        if (num_left > 0) {
                                            update = `Make ${num_left} more recommendation${num_left > 1 ? 's' : ''} to send these items to the user!`
                                        }
                                        else {
                                            update = 'These recommendations will be sent to the user soon!'
                                        }
                                        var prompt = prompts[Math.floor(Math.random() * prompts.length)]
                                        console.log('got recs:', recs)
                                        this.props.notify(
                                            <div className="small">
                                                <strong>
                                                    {prompt + ' ' + update}
                                                </strong>
                                            </div>
                                        ); 
                                    }
                                )
                            }
                        )
                    },
                    () => {
                        this.props.notify(
                            <div className="medium">
                                Something went wrong 😭. Let Harry know!
                            </div>
                        )
                    }
                )
            }
        )
        .catch(err => alert(err))
    }

    render() {
        var sub = queryString.parse(window.location.search).sub
        var page = this.state.page
        var disabled
        var style
        if (page == 1) {
            disabled = this.state.img_files.length == 0
            style = {opacity: disabled ? 0.5 : 1}
            return (
                <div className="add-rec-item">
                    <div className="medium">
                        1. Upload images of the product
                    </div>
                    <div className="small">
                        The user will receive the first image that you upload, exactly as you upload it
                    </div>
                    {/* <div className="demo">
                        {/* <div className="medium">
                            <div className="medium">
                                Bad image
                            </div>
                            <br/>
                            <img src={bad_img} alt="" />
                            <div className="small">
                                <ul>
                                    <li>Nobody deserved a pixelated image!</li>
                                    <li>Which item is the image referring to?</li>
                                </ul>
                            </div>
                        </div>
                        <div className="medium">
                            <div className="medium">
                                a good image
                            </div>
                            <img src={good_img} alt="" />
                            <div className="small">
                                <ul>
                                    <li>Just shows the product.</li>
                                    <li>Image obviously refers to a particular item</li>
                                </ul>
                            </div>
                        </div>
                    </div> */}
                    <div style={{width: "90vw"}}>
                        <div className="rec-img-container">
                            <div className="small" style={{float: "left"}}>
                                Images
                            </div>
                            <div>
                                {this.getImgs()}
                            </div>
                        </div>
                        <div className="btn rec-img-upload">
                            <input id="upload-rec-img" type="file" style={{display: "none"}} accept="image/*" name="img" onChange={this.setImgs} multiple />
                            <label for="upload-rec-img">Add images</label>
                        </div>
                    </div>
                    <button className="btn" onClick={this.next} disabled={disabled} style={style}>
                        Next step!
                    </button>
                </div>
            )
        }
        else if (page == 2) {
            disabled = this.state.item.caption == ''
            style = {opacity: disabled ? 0.5 : 1}
            return (
                <div className="add-rec-item">
                    <div className="medium">
                        2. Send a message to the user along with this item
                    </div>
                    <div className="add-item-input">
                        <div className="small">
                            Let them know why you made this specific recommendation.
                            <br/>
                            <br/> 
                            Examples: 
                            <br/>
                            This will go perfectly with the red jacket you own. 
                            <br/> 
                            This is the best material to keep you cool on your holiday that you told me about. 
                            <br/> 
                            It's 20% off!
                            <br/> 
                            ETC
                        </div>
                        <input id="caption" className="add-item-input-field medium" value={this.state.item.caption} onChange={this.handleTextChange}/>
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        <div className="btn" onClick={this.previous} style={{minWidth: "50px", width: "auto"}}>
                            Back
                        </div>
                        <button className="btn" onClick={this.next} disabled={disabled} style={style}>
                            Next step!
                        </button>
                    </div>
                </div>
            )
        }
        else if (page == 3) {
            disabled = this.state.item.brand == ''
            style = {opacity: disabled ? 0.5 : 1}
            return (
                <div className="add-rec-item">
                    <div className="medium">
                        3. The brand
                    </div>
                    <div className="add-item-input">
                        <div className="small">
                            What brand is the product from?
                        </div>
                        <input id="brand" className="add-item-input-field medium" value={this.state.item.brand} onChange={this.handleTextChange}/>
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        <div className="btn" onClick={this.previous} style={{minWidth: "50px", width: "auto"}}>
                            Back
                        </div>
                        <button className="btn" onClick={this.next} disabled={disabled} style={style}>
                            Next step!
                        </button>
                    </div>
                </div>
            )
        }
        else if (page == 4) {
            disabled = this.state.item.url == ''
            style = {opacity: disabled ? 0.5 : 1}
            return (
                <div className="add-rec-item">
                    <div className="medium">
                        4. The URL
                    </div>
                    <div className="add-item-input">
                        <div className="small">
                            Enter the web URL where you can buy the product from
                        </div>
                        <input id="url" className="add-item-input-field medium" value={this.state.item.url} onChange={this.handleTextChange}/>
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        <div className="btn" onClick={this.previous} style={{minWidth: "50px", width: "auto"}}>
                            Back
                        </div>
                        <button className="btn" onClick={this.next} disabled={disabled} style={style}>
                            Next step!
                        </button>
                    </div>
                </div>
            )
        }
        else if (page == 5) {
            disabled = this.state.item.price == '' || !this.state.item.currency
            style = {opacity: disabled ? 0.5 : 1}
            return (
                <div className="add-rec-item">
                    <div className="medium">
                        5. Price
                    </div>
                    <div className="add-item-input">
                        <div className="small">
                            What's the price?
                        </div>
                        <input id="price" className="add-item-input-field medium text-response" value={this.state.item.price} onChange={this.handleTextChange}/>
                        <Dropdown onChange={this.handleOptionChange} id="currency" value={this.state.currency} prompt='What currency?' name='currency' options={['$', '£']}/>
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        <div className="btn" onClick={this.previous} style={{minWidth: "50px", width: "auto"}}>
                            Back
                        </div>
                        <button className="btn" onClick={this.next} disabled={disabled} style={style}>
                            Next step!
                        </button>
                    </div>
                </div>
            )
        }
        else if (page == 6) {
            disabled = this.state.item.product_type.length <= 0
            style = {opacity: disabled ? 0.5 : 1}
            var allOptions = this.state.allTypes
            var options = this.state.item.product_type
            return (
                <div className="add-rec-item">
                    <div className="add-item-input">
                        <div className="medium">
                            6. Product type
                        </div>
                        {/* <textarea id="tags" className="add-item-input-field medium" value={
                                this.state.item.tags != null ? this.state.item.tags.join(',') : []
                            } onChange={this.handleTextChange}/> */}
                        <div className="panel">
                            <div className="" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                                {
                                    allOptions.map(
                                        (item) => {
                                        // console.log(item)
                                            var opacity = options.includes(item) ? '1' : '0.5'
                                            return <React.Fragment>
                                                <label for={item} style={{opacity}} value={options.includes(item)}>
                                                    <button className="btn text-btn" id={item} name='product_type' onClick={this.handleArrayOptionChange}>
                                                        <input className="radio_btn" type="radio" checked={options.includes(item)}/>
                                                        {item}
                                                    </button>
                                                </label>
                                            </React.Fragment>
                                        }
                                    )
                                }
                            </div>
                            <div style={{marginTop: '30px'}}>
                                <div><strong>Something else?</strong></div>
                                <div className="searchbar">
                                    <input value={this.state.request} onChange={this.handleRequestChange} className="text-response" placeholder='Enter a missing type...' style={{fontSize: '13px'}} />
                                    <button onClick={this.submitRequest}>
                                        {
                                            this.state.request_loading ?
                                            <Loading />
                                            :
                                            <img src={sendIcon} style={{height: '30px'}} />
                                        }
                                    </button>
                                </div>
                            </div>
                            {/* <button className="btn" onClick={this.handleSubmit}>
                                Done
                            </button> */}
                        </div>
                        {/* <Style title='6. Tag product'/> */}
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        <div className="btn" onClick={this.previous} style={{minWidth: "50px", width: "auto"}}>
                            Back
                        </div>
                        <button className="btn" onClick={this.next} disabled={disabled} style={style}>
                                Next!
                        </button>
                    </div>
                </div>
            )
        }
        else if (page == 7) {
            disabled = this.state.item.tags.length <= 0
            style = {opacity: disabled ? 0.5 : 1}
            var allStyles = this.state.allStyles
            var styles = this.state.item.tags
            return (
                <div className="add-rec-item">
                    <div className="add-item-input">
                        <div className="medium">
                            6. Tag the product
                        </div>
                        {/* <textarea id="tags" className="add-item-input-field medium" value={
                                this.state.item.tags != null ? this.state.item.tags.join(',') : []
                            } onChange={this.handleTextChange}/> */}
                        <div className="panel">
                            <div className="medium">
                                {/* Your style */}
                                {this.props.title}
                            </div>
                            <div className="" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                                {
                                    allStyles.map(
                                        (item) => {
                                        // console.log(item)
                                            var opacity = styles.includes(item) ? '1' : '0.5'
                                            return <React.Fragment>
                                                <label for={item} style={{opacity}} value={styles.includes(item)}>
                                                    <button className="btn text-btn" id={item} name='tags' onClick={this.handleArrayOptionChange}>
                                                        <input className="radio_btn" type="radio" checked={styles.includes(item)}/>
                                                        {item}
                                                    </button>
                                                </label>
                                            </React.Fragment>
                                        }
                                    )
                                }
                            </div>
                            <div style={{marginTop: '30px'}}>
                                <div><strong>Enter your own tag!</strong></div>
                                <div className="searchbar">
                                    <input value={this.state.request} onChange={this.handleRequestChange} className="text-response" placeholder='Enter a missing word...' style={{fontSize: '13px'}} />
                                    <button onClick={this.submitRequest}>
                                        {
                                            this.state.request_loading ?
                                            <Loading />
                                            :
                                            <img src={sendIcon} style={{height: '30px'}} />
                                        }
                                    </button>
                                </div>
                            </div>
                            {/* <button className="btn" onClick={this.handleSubmit}>
                                Done
                            </button> */}
                        </div>
                        {/* <Style title='6. Tag product'/> */}
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        <div className="btn" onClick={this.previous} style={{minWidth: "50px", width: "auto"}}>
                            Back
                        </div>
                        <button className="btn" onClick={this.recommendItem} disabled={disabled} style={style}>
                            {
                                this.state.loading ?
                                <Loading /> :
                                'Recommend!'
                            }
                        </button>
                    </div>
                </div>
            )
        }
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
        },
        notify: (content) => {
            dispatch({
                type: "NOTIFY",
                content
            })
        }
    }
}

export default AddRecItem = connect(null, mapDispatchToProps)(AddRecItem)





class MakeRecommendations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recs: []
        }
    }

    componentDidMount = () => {
        console.log('getting recommendations')
        this.getRecs()
    }

    getRecs = () => {
        console.log('getting latest recommendations')
        var params = queryString.parse(window.location.search)
        console.log(params)
        var req_id = params.req_id
        /*
        makeGetRequest(`recommendations?req_id=${req_id}`, 
            (recs) =>{
                console.log('got recommendations')
                recs = recs.body
                recs = JSON.parse(recs)
                console.log('recommendations:', recs)
                recs = recs.map(
                    (rec) => {
                        return <RecommendationItem src={rec.img_urls[0]} id={rec['Item ID']}/>//<img src={rec.img_urls[0]} alt="" className="rec-img-thumb"/>
                    }
                )
                this.setState({recs: recs},
                    console.log(this.state)    
                )
            }
        )
        */
    }

    makeRecommendations = () => {
        var req_id = queryString.parse(window.location.search).req_id
        var sub = queryString.parse(window.location.search).sub
        makePostRequest(`update-order-status?sub=${sub}&req_id=${req_id}`, {nextStatus: 'recommendations_made'}, () => {console.log('order updated')})

        this.props.refresh()
    }

    render () {
        console.log(this.props)
        return (
                <div className="medium slideUp-content" style={{position: "absolute", top: "8vh"}}>
                    Make recommendations
                    <div className='recommendations-to-be-made' style={{padding: "10px"}}>
                        {this.state.recs}
                    </div>
                    <div className="btn small" onClick={() => this.props.openModal(<AddRecItem onRecommend={this.props.refresh} closeModal={this.props.closeModal} />)}>
                        Recommend a new item!
                    </div>
                    <div className="btn small" onClick={this.clo}>
                        Send these recommendations
                    </div>
                </div>
        )
    }
}

class RecommendationItem extends Component {

    render () {
        return (
            <div className="recommendation-item" id={this.props.id}>
                <img className="rec-img-thumb" src={this.props.src} alt=''  />
            </div>
        )
    }
}
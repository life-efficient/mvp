import React from "react"
import "./Loading.css"
import { RingLoader as Loader} from 'react-spinners';

const Loading = () => {
    return (
        <Loader css={{margin: 'auto'}} size={20} sizeUnit={'px'} />
        // <div className="loading">
        //     <div className="loading-segment"></div>
        //     <div className="loading-inner"></div>
        // </div>
    )
}

export default Loading
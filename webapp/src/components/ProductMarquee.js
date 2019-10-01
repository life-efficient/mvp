import React from "react"
import "./ProductMarquee.css"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

var maleimages = importAll(require.context('../images/swipe-images/male', false))
var femaleimages = importAll(require.context('../images/swipe-images/female', false))
function getImgs(images){
    // var images = importAll(require.context(folder, false))
    images = Object.keys(images).map(
        (img) => {
            console.log(img)
            return <img src={images[img]} alt="" className="marquee-product" />
        }
    )
    images = shuffle(images)
    return images
}
maleimages = getImgs(maleimages)
femaleimages = getImgs(femaleimages)

const ProductMarquee = (props) => {
    return (
        <div className={props.dir == "toRight" ? "product-marquee toRight" : "product-marquee toLeft"}>
            {
                props.gender =='male' ?
                maleimages :
                femaleimages
            }
        </div>
    )
}

export default ProductMarquee
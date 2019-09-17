
import React from "react"
import "./TestimonialMarquee.css"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

var images = importAll(require.context('../images/testimonials', false));
console.log(images)
console.log(Object.keys(images).length)
images = Object.keys(images).map(
    (img) => {
        var h_start = 150 * ( Math.random() - 0.5 )
        var max_width = 250 + 100*Math.random()
        console.log(img)
        return <img src={images[img]} alt="" className="marquee-testimonial" style={{maxWidth: `${max_width}px`, transform: `translateY(${h_start}px)`}}/>
    }
)

const TestimonialMarquee = (props) => {
    return (
        <div  className={props.dir == "toRight" ? "testimonial-marquee toRight" : "testimonial-marquee toLeft"}>
            {images}
        </div>
    )
}

export default TestimonialMarquee
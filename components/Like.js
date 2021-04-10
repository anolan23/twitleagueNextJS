import TwitIcon from "./TwitIcon";
import like from "../sass/components/Like.module.scss";
function Like(props){
    if(props.liked){
        return <TwitIcon className={props.className} icon="/SVG/heart-filled.svg#svg1424"/>
       
    }
    else{
        return <TwitIcon className={props.className} icon="/sprites.svg#icon-heart"/>
    }
}
export default Like;
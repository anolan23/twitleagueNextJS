import twitBadge from "../sass/components/TwitBadge.module.scss";

function TwitBadge(props){

    const outlook = () => {
        if(props.children === "Hot"){
            return twitBadge["twit-badge__hot"]
        }
        else if(props.children === "Cold"){
            return twitBadge["twit-badge__cold"]
        }
        else{
            return twitBadge["twit-badge__gray"]
        }
    }

    const select = () => {
        if(!props.active){
            return null
        }
        else{
            return twitBadge["twit-badge__active"]
        }
    }

    return(
        <div onClick={props.onClick} className={`${twitBadge["twit-badge"]} ${outlook()} ${select()}`}>
            {props.children}
        </div>
    )
}

export default TwitBadge;
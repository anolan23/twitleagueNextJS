function TwitIcon(props){
    return(
        <svg className={props.className} onClick={props.onClick}>
            <use xlinkHref={props.icon}/>
        </svg>
    )
}
export default TwitIcon;
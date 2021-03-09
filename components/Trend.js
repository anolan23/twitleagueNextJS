import trend from "../sass/components/Trend.module.scss";

function Trend(props) {
    return(
        <div className={trend["trend"]}>
            <span className={trend["trend__topic"]}>{`${props.topic} · Trending`}</span>
            <span className={trend["trend__trend"]}>{props.trend}</span>
            <span className={trend["trend__count"]}>{`${props.count} Posts`}</span>
        </div>
    )
}

export default Trend;
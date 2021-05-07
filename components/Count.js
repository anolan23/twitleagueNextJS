import Link from "next/link";

import count from "../sass/components/Count.module.scss";

function Count(props) {
  return (
    <div className={count["count"]}>
      <Link passHref href={props.href}>
        <a className={count["count__box"]}>
          <span className={count["count__box__value"]}>{props.value}</span>
          &nbsp;
          <span className={count["count__box__text"]}>{props.text}</span>
        </a>
      </Link>
    </div>
  );
}

export default Count;

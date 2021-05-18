import Link from "next/link";

import count from "../sass/components/Count.module.scss";

function Count({ href, value, text }) {
  return (
    <div className={count["count"]}>
      <Link passHref href={href}>
        <a className={count["count__box"]}>
          <span className={count["count__box__value"]}>{value}</span>
          &nbsp;
          <span className={count["count__box__text"]}>{text}</span>
        </a>
      </Link>
    </div>
  );
}

export default Count;

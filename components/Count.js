import { useRouter } from "next/router";
import count from "../sass/components/Count.module.scss";

function Count({ href, value, text, onClick }) {
  const router = useRouter();
  function onCountClick() {
    if (href) {
      router.push(href);
    } else {
      onClick();
    }
  }
  return (
    <div className={count["count"]} onClick={onCountClick}>
      <div className={count["count__box"]}>
        <span className={count["count__box__value"]}>{value}</span>
        &nbsp;
        <span className={count["count__box__text"]}>{text}</span>
      </div>
    </div>
  );
}

export default Count;

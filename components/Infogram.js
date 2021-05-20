import Link from "next/link";
import { useRouter } from "next/router";

import infogram from "../sass/components/Infogram.module.scss";
import Avatar from "./Avatar";
import Count from "./Count";
import Linkify from "./Linkify";

function Infogram({ action, info, href }) {
  const router = useRouter();

  const onAvatarClick = (event) => {
    event.stopPropagation();
    router.push(href);
  };

  const renderBio = () => {
    if (info.bio) {
      return (
        <p className={infogram["infogram__bio"]}>
          <Linkify string={info.bio} />
        </p>
      );
    } else {
      return null;
    }
  };

  if (!info) {
    return (
      <dialog className={infogram["infogram"]} open>
        <div>Loading...</div>
      </dialog>
    );
  } else {
    return (
      <dialog className={infogram["infogram"]} open>
        <div className={infogram["infogram__heading"]}>
          <Avatar
            className={infogram["infogram__heading__avatar"]}
            src={info.avatar}
            onClick={onAvatarClick}
          />
          <div className={infogram["infogram__heading__action"]}>{action}</div>
        </div>
        <div className={infogram["infogram__title"]}>
          <Link passHref href={href}>
            <a
              onClick={(e) => e.stopPropagation()}
              className={infogram["infogram__title__main"]}
            >
              {info.main}
            </a>
          </Link>
          <span className={infogram["infogram__title__sub"]}>
            {info.secondary}
          </span>
        </div>
        {renderBio()}
        {
          <div className={infogram["infogram__counts"]}>
            {info.scouts ? (
              <Count href="/" text="Scouts" value={info.scouts} />
            ) : null}
            {info.scouting ? (
              <Count href="/" text="Scouting" value={info.scouting} />
            ) : null}
            {info.followers ? (
              <Count href="/" text="Followers" value={info.followers} />
            ) : null}
            {info.following ? (
              <Count href="/" text="Following" value={info.following} />
            ) : null}
          </div>
        }
      </dialog>
    );
  }
}
export default Infogram;

import Link from 'next/link';

import twitPanelItem from '../sass/components/TwitPanelItem.module.scss';

function TwitPanelItem(props) {
  return (
    <Link
      href={props.href}
      onClick={props.onClick}
      className={twitPanelItem['twit-panel-item']}
    >
      <div className={twitPanelItem['twit-panel-item__icon-box']}>
        <svg className={twitPanelItem['twit-panel-item__icon']}>
          {props.children}
        </svg>
      </div>
      <span className={twitPanelItem['twit-panel-item__text']}>
        {props.text}
      </span>
    </Link>
  );
}
export default TwitPanelItem;

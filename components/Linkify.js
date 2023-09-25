import Link from 'next/link';
import reactStringReplace from 'react-string-replace';

import { fetchTeam, fetchUserByUsername } from '../actions';
import { truncate } from '../lib/twit-helpers';
import TwitLink from './TwitLink';

function Linkify({ string, user, hasTwitLinks }) {
  let linkifiedString;
  linkifiedString = reactStringReplace(string, /\$(\w+)/g, (match, i) => {
    if (hasTwitLinks) {
      return (
        <TwitLink
          key={match + i}
          className="twit-link"
          href={`/teams/${match}`}
          type="team"
          getInfo={async () => await fetchTeam(match, user.id)}
        >
          {`$${match}`}
        </TwitLink>
      );
    } else {
      return (
        <Link key={match + i} className="twit-link" href={`/teams/${match}`}>
          {`$${match}`}
        </Link>
      );
    }
  });

  linkifiedString = reactStringReplace(
    linkifiedString,
    /@(\w+)/g,
    (match, i) => {
      if (hasTwitLinks) {
        return (
          <TwitLink
            key={match + i}
            className="twit-link"
            href={`/users/${match}`}
            type="user"
            getInfo={async () => await fetchUserByUsername(match, user.id)}
          >
            {`@${match}`}
          </TwitLink>
        );
      } else {
        return (
          <Link key={match + i} className="twit-link" href={`/users/${match}`}>
            {`@${match}`}
          </Link>
        );
      }
    }
  );

  linkifiedString = reactStringReplace(
    linkifiedString,
    /(https?:\/\/\S+)/g,
    (match, i) => (
      <Link
        key={match + i}
        href={match}
        className="twit-link"
        onClick={(e) => e.stopPropagation()}
      >
        {truncate(match, 35)}
      </Link>
    )
  );
  return linkifiedString;
}

export default Linkify;

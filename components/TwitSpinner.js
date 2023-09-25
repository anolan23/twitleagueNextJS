import ClipLoader from 'react-spinners/ClipLoader';
import twitSpinner from '../sass/components/TwitSpinner.module.scss';

function TwitSpinner({ style, size }) {
  return (
    <div className={twitSpinner['twit-spinner']} style={style}>
      <ClipLoader loading={true} color="#1da1f2" size={size} />
    </div>
  );
}
export default TwitSpinner;

function TwitIcon({ className, onClick, icon }) {
  return (
    <svg className={className} onClick={onClick}>
      <use xlinkHref={icon} />
    </svg>
  );
}
export default TwitIcon;

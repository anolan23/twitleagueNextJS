import twitForm from "../sass/components/TwitForm.module.scss";

function TwitInputGroup({ id, labelText, children }) {
  return (
    <div className={twitForm["twit-form__group"]}>
      <label htmlFor={id} className={twitForm["twit-form__label"]}>
        {labelText}
      </label>
      {children}
    </div>
  );
}

export default TwitInputGroup;

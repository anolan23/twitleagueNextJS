import twitForm from "../sass/components/TwitForm.module.scss";

function TwitForm({ id, onSubmit, children }) {
  return (
    <form onSubmit={onSubmit} className={twitForm["twit-form"]} id={id}>
      {children}
    </form>
  );
}

export default TwitForm;

import Input from "./Input";
import twitForm from "../sass/components/TwitForm.module.scss";

function InputGroup(props) {
  return (
    <div className={twitForm["twit-form__group"]}>
      <label htmlFor={props.id} className={twitForm["twit-form__label"]}>
        {props.labelText}
      </label>
      <Input
        id={props.id}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        name={props.name}
        type={props.type}
        className={props.className}
        placeHolder={props.placeHolder}
      />
    </div>
  );
}

export default InputGroup;

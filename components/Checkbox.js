import checkbox from "../sass/components/Checkbox.module.scss";

function Checkbox({ type, checked, onChange }) {
  return (
    <div className={checkbox["checkbox"]} onClick={onChange}>
      <input type={type} checked={checked} onChange={onChange} />
      <label className={checkbox["checkbox__label"]}></label>
    </div>
  );
}
export default Checkbox;

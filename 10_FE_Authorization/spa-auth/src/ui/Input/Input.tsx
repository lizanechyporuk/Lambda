import styles from "./Input.module.scss";

interface InputProps {
  text: string;
  type: string;

  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function Input({
  text,
  type,
  name,
  value,
  onChange,
  required,
}: InputProps): JSX.Element {
  return (
    <input
      className={styles.formInput}
      placeholder={text}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    ></input>
  );
}

export default Input;

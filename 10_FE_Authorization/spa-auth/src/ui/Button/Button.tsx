import styles from "./Button.module.scss";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  text: string;
  classBtn: string;
}

function Button({
  text,
  type = "button",
  classBtn,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button type={type} className={styles[classBtn]} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;

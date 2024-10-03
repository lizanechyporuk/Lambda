import { ReactNode } from "react";
import styles from "./Container.module.scss";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps): JSX.Element {
  return <div className={styles.container}>{children}</div>;
}

export default Container;

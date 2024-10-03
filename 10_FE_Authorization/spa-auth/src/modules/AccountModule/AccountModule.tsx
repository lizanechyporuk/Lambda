import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "scripts/auth/auth";
import styles from "./AccountModule.module.scss";
import Button from "ui/Button/Button";
import Container from "components/Container/Container";

const AccountModule: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      setUserEmail(email);
    } else {
      navigate("/sign-in");
    }
  }, [navigate]);

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.header}>Account Page</h1>
      </header>
      <main>
        <Container>
          {userEmail ? (
            <p className={styles.info}>
              Welcome,{" "}
              <span className={styles.email}>{userEmail.split("@")[0]}</span>
            </p>
          ) : (
            <p className={styles.info}>Loading...</p>
          )}

          <Button
            text="Logout"
            type="button"
            classBtn="filledBtnSecondary"
            onClick={handleLogout}
          />
        </Container>
      </main>
    </>
  );
};

export default AccountModule;

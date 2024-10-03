import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SignInForm from "components/SignInForm/SignInForm";
import SignUpForm from "components/SignUpForm/SignUpForm";
import Container from "components/Container/Container";
import styles from "./WelcomeModule.module.scss";
import Button from "ui/Button/Button";

const WelcomeModule = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/sign-up") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  const handleToggle = () => {
    if (isSignUp) {
      navigate("/sign-in");
    } else {
      navigate("/sign-up");
    }
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={`${styles.loginPage} ${isSignUp ? styles.slide : ""}`}>
      <Container>
        <img src="/icons/logo.png" alt="Logo" className={styles.logo} />
        <div className={styles.container}>
          <div className={`${styles.box} ${styles.signin}`}>
            <h2>Already Have an Account?</h2>
            <Button
              type="button"
              text="Sign In"
              classBtn="filledBtnPrimary"
              onClick={() => handleToggle()}
            />
          </div>
          <div className={`${styles.box} ${styles.signup}`}>
            <h2>Don't Have an Account?</h2>
            <Button
              type="button"
              text="Sign Up"
              classBtn="filledBtnPrimary"
              onClick={() => handleToggle()}
            />
          </div>

          <div className={styles.formBox}>
            <div
              className={`${styles.form} ${styles.signinForm} ${
                isSignUp ? styles.hidden : ""
              }`}
            >
              <SignInForm />
            </div>
            <div
              className={`${styles.form} ${styles.signupForm} ${
                isSignUp ? "" : styles.hidden
              }`}
            >
              <SignUpForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default WelcomeModule;

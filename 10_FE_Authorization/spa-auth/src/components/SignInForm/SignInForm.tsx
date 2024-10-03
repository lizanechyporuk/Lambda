import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "scripts/auth/auth";
import styles from "./SignInForm.module.scss";
import Input from "ui/Input/Input";
import Button from "ui/Button/Button";

const SignInForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const success = await login(formData.email, formData.password);

      console.log("Login success:", success);

      if (success) {
        console.log("Navigating to /me");
        navigate("/me");
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Sign In</h3>
      <Input
        type="text"
        name="email"
        text="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <Input
        type="password"
        name="password"
        text="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <Button type="submit" text="Login" classBtn="filledBtnSecondary" />
    </form>
  );
};

export default SignInForm;

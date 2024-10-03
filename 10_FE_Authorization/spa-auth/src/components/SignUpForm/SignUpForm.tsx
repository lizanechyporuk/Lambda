import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "scripts/auth/auth";
import styles from "./SignUpForm.module.scss";
import Input from "ui/Input/Input";
import Button from "ui/Button/Button";

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignUpData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await signUp(email, password);

      if (response && response.error) {
        alert(response.error);
      } else {
        alert("Sign Up successful! You can now log in.");
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Sign Up</h3>
      <Input
        type="email"
        name="email"
        text="Email Address"
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
      <Input
        type="password"
        name="confirmPassword"
        text="Conform Password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        required
      />
      <Button type="submit" text="Register" classBtn="filledBtnSecondary" />
    </form>
  );
};

export default SignUpForm;

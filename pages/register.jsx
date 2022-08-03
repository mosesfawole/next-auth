import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import Loader from "./Loader";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase.config";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const { signup, currentUser } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "" || confirmation === "") {
      return setError("Please fill all fields");
    }
    if (password !== confirmation) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      alert("Registration successful");
      router.push("/login");
    } catch (error) {
      setLoading(false);
      if (currentUser.email === email) {
        return setError("Email already exists");
      }
      setError(error.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Registration successful");
      router.push("/");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  const handleGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      alert("Registration successful");
      router.push("/");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>NEXT CRUD AUTH App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Register</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.error}>{error}</p>
          <input
            className={styles.inputBox}
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.inputBox}
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className={styles.inputBox}
            placeholder="Password Confirmation"
            value={confirmation}
            type="password"
            onChange={(e) => setConfirmation(e.target.value)}
          />
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
        <button onClick={handleGoogle} className={styles.button}>
          Sign Up with Google{" "}
          <i className="fa fa-google" aria-hidden="true"></i>{" "}
        </button>
        <button onClick={handleGithub} className={styles.button}>
          Sign Up Github
        </button>
      </main>
    </div>
  );
};
export default Register;

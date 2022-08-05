import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Router from "next/router";
import Loader from "./Loader";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      return setError("Please fill all fields");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      return Router.push("/");
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
        <h1>Login</h1>
        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
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

            <button type="submit" className={styles.button}>
              Sign In
            </button>
          </form>
          <div className="">
            <button onClick={handleGoogle} className={styles.button}>
              Continue with Google
            </button>
            <button onClick={handleGithub} className={styles.button}>
              Continue with Github
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

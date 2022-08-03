import Head from "next/head";
import styles from "../styles/Home.module.css";
import { app } from "../firebase.config";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Router from "next/router";
import Loader from "./Loader";
const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

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

          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;

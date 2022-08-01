import Head from "next/head";
import styles from "../styles/Home.module.css";
import { app } from "../firebase.config";
import { useEffect } from "react";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
      return unsubscribe;
    });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>NEXT CRUD AUTH App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Home</h1>
      </main>
    </div>
  );
}

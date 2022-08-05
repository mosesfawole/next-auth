import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, database } from "../firebase.config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
const databaseRef = collection(database, "CRUD data");
export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      return router.push("/login");
    } catch (error) {
      setError("Logout Failed");
    }
  };

  const addData = (e) => {
    e.preventDefault();
    setLoading(true);

    setMessage("");
    if (name === "" || age === "") {
      setLoading(false);
      return setError("Please fill all fields");
    }
    if (name.length < 3) {
      setLoading(false);
      return setError("Name must be at least 3 characters long");
    }
    addDoc(databaseRef, {
      name,
      age,
    })
      .then(() => {
        getData();
        setError("");
        setMessage("Data added successfully");
        setName("");
        setAge(null);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
      });
  };

  const getData = async () => {
    await getDocs(databaseRef)
      .then((response) => {
        setData(
          response.docs.map((items) => {
            return { ...items.data(), id: items.id };
          })
        );
      })
      .catch((error) => {
        setError(error.message);
        setError("Failed to fetch data");
      });
  };

  const getID = (id, name, age) => {
    setName(name);
    setAge(age);
    setId(id);
    setIsUpdate(true);
  };

  const updateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    // if (name === Number) {
    //   return setError("Please enter a string");
    // }
    if (name === "" || age === "") {
      return setError("Please fill all fields");
    }
    const bookDoc = doc(database, "CRUD data", id);
    await updateDoc(bookDoc, {
      name: name,
      age: Number(age),
    })
      .then(() => {
        setMessage("Data updated successfully");
        setName("");
        setAge(null);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const deleteData = async (id) => {
    setLoading(true);
    const bookDoc = doc(database, "CRUD data", id);
    await deleteDoc(bookDoc)
      .then(() => {
        getData();
        setMessage("Data deleted");
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to delete data");
        setError(error.message);
      });
  };
  useEffect(() => {
    getData();
    if (!currentUser) {
      router.push("/login");
    }
    setError("");
  }, []);
  if (message) {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }
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
        <h1>Dashboard</h1>

        <form className={styles.form}>
          <p className={styles.error}>{error}</p>
          <p className={styles.message}>{message}</p>
          <input
            type="text"
            placeholder="Name"
            className={styles.inputBox}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            className={styles.inputBox}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          {isUpdate ? (
            <button
              onClick={updateData}
              className={styles.button}
              type="submit"
            >
              Update
            </button>
          ) : (
            <button onClick={addData} className={styles.button} type="submit">
              ADD
            </button>
          )}
          <button onClick={handleLogout} className={styles.button}>
            LOG OUT
          </button>
        </form>
        <div className="">
          {data.map((item) => {
            return (
              <div key={item.id} className={styles.list}>
                <h3>Name: {item.name}</h3>
                <p>Age: {item.age}</p>
                <button
                  onClick={() => getID(item.id, item.name, item.age)}
                  className={styles.button}
                >
                  {" "}
                  Update
                </button>
                <button
                  onClick={() => deleteData(item.id)}
                  className={styles.delete}
                >
                  {" "}
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

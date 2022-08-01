import styles from "../styles/Home.module.css";

const Loader = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
};

export default Loader;

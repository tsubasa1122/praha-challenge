import { VFC } from "react";
// 本来ならCSSをちゃんと分離したい
import styles from "../styles/Home.module.css";
import { FetchComponent } from "./FetchComponent";

const Ssr: VFC = () => {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <FetchComponent />

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.tsx</code>
        </p>
      </main>
    </>
  );
};

export default Ssr;

import type { InferGetServerSidePropsType } from "next"
// 本来ならCSSをちゃんと分離したい
import styles from "../styles/Home.module.css";
import FetchComponent from "../components/FetchComponent";

const REACT_REPOSITORY_API_URL = "https://api.github.com/repos/facebook/react"

export async function getServerSideProps() {
  const response = await fetch(REACT_REPOSITORY_API_URL);
  const data = await response.json();

  return {props: {
    subscribers: data.subscribers_count,
    stars: data.stargazers_count 
  }}
}

function Ssr(data: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <FetchComponent data={data} />

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.tsx</code>
        </p>
      </main>
    </>
  );
}

export default Ssr;

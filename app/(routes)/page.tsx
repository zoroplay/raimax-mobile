import styles from "./page.module.scss";
import { HomeBlock } from "@/_blocks";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className={styles.main}>
      <Suspense>
        <HomeBlock />
      </Suspense>
    </main>
  );
}

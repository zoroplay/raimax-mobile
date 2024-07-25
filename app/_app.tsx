// pages/_app.tsx
import type { AppProps } from "next/app";
import ReduxProvider from "./_provider/redux-provider";
import { Suspense } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Suspense>
        <Component {...pageProps} />
      </Suspense>
    </ReduxProvider>
  );
}

export default MyApp;

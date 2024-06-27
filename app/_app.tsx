// pages/_app.tsx
import type { AppProps } from "next/app";
import ReduxProvider from "./_provider/redux-provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}

export default MyApp;

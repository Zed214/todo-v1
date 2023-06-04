import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import Layout from "../components/layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;

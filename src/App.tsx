import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { faIR } from "@mui/material/locale";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import "./assets/css/Fontiran.css";
import router from "./routers/MainRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { ConfirmDialogProvider } from "./contexts/ConfirmDialogContext";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const queryClient = new QueryClient();

function App() {
  const [mode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme(
        {
          direction: "rtl",
          palette: {
            primary: {
              main: "#20AD95",
            },
            secondary: {
              main: "#a3f5ea",
            },
            mode,
          },
          typography: {
            fontFamily: "IRANSans",
            allVariants: {
              fontWeight: 500,
            },
          },
        },
        faIR
      ),
    [mode]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <ConfirmDialogProvider>
              <RouterProvider router={router} />
            </ConfirmDialogProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}

export default App;

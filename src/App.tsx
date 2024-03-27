import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { faIR } from "@mui/material/locale";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useMemo, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import "./assets/css/Fontiran.css";
import router from "./routers/MainRouter";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  const [mode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme(
        {
          direction: "rtl",
          palette: {
            primary: {
              main: "#407BFF",
              light: "#E9F3FF",
              dark: "#193E92",
            },
            secondary: {
              main: "#999",
              light: "#F8FAFC",
            },
            success: {
              main: "#3CD4A0",
              contrastText: "#fff",
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
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;

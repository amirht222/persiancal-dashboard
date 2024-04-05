import React from "react";
import { SnackbarDialog } from "../contexts/SnackbarContext";
export default function useSnackbar() {
  return React.useContext(SnackbarDialog);
}

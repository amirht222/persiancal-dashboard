import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import useSnackbar from "../../../hooks/useSnackbar";

export default function ISnackbar(props: ISnackbarProps) {
  const { hideSnack } = useSnackbar();
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    hideSnack();
  };
  return (
    <>
      <Snackbar
        open={props.isOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        aria-label="snakbar"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={props.type}
          sx={{ width: "100%", color: "#fff" }}
          onClose={handleClose}
          variant="filled"
        >
          {props.message}
        </Alert>
      </Snackbar>
    </>
  );
}

type ISnackbarProps = {
  isOpen: boolean;
  type: AlertColor | undefined;
  message: string | undefined;
  closeHandler: () => void;
};

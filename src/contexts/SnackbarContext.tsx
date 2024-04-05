/* eslint-disable @typescript-eslint/no-empty-function */
import { AlertColor } from "@mui/material/Alert";

import ISnackbar from "../components/UI/snackbar";
import { ISnackbarState } from "../constants/GlobalTypes";
import { PropsWithChildren, createContext, useCallback, useState } from "react";

export const SnackbarDialog = createContext<{
  showSnack: (data: {
    message: string | undefined;
    type: AlertColor | undefined;
  }) => void;
  hideSnack: () => void;
}>({ showSnack: () => {}, hideSnack: () => {} });

export function SnackbarProvider(props: PropsWithChildren) {
  const [dialogStates, setDialogStates] = useState<ISnackbarState>({
    isOpen: false,
    type: undefined,
    message: undefined,
  });

  const showSnack = useCallback(
    (data: { message: string | undefined; type: AlertColor | undefined }) => {
      setDialogStates({ ...data, isOpen: true });
    },
    []
  );

  const hideSnack = useCallback(() => {
    setDialogStates((state) => ({ ...state, isOpen: false }));
  }, []);

  return (
    <SnackbarDialog.Provider value={{ showSnack, hideSnack }}>
      {props.children}
      <ISnackbar {...dialogStates} closeHandler={hideSnack} />
    </SnackbarDialog.Provider>
  );
}

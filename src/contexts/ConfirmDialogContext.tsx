/* eslint-disable @typescript-eslint/no-empty-function */
import IConfirmDialog from "../components/UI/confirm-dialog";
import { IConfirmDialogStates } from "../constants/GlobalTypes";
import { createContext, useCallback, useState } from "react";

export const ConfirmDialog = createContext<{
  openConfirm: (data: IConfirmDialogStates) => void;
  closeConfirm: () => void;
}>({ openConfirm: () => {}, closeConfirm: () => {} });

export function ConfirmDialogProvider(props: any) {
  const [dialogStates, setDialogStates] = useState<IConfirmDialogStates>({
    isOpen: false,
    title: "Confirmation Dialog",
    description: "Are you sure?",
    cancelBtnLabel: "cancel",
    confirmBtnLabel: "confirm",
    onCancel: () => {},
    onConfirm: () => {},
  });

  const openConfirm = useCallback((data: IConfirmDialogStates) => {
    setDialogStates({ ...data, isOpen: true });
  }, []);

  const closeConfirm = useCallback(() => {
    setDialogStates((state) => ({ ...state, isOpen: false }));
  }, []);

  return (
    <ConfirmDialog.Provider value={{ openConfirm, closeConfirm }}>
      {props.children}
      <IConfirmDialog {...dialogStates} onClose={closeConfirm} />
    </ConfirmDialog.Provider>
  );
}

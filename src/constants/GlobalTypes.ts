/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertColor } from "@mui/material/Alert";

export interface IDialogState {
  mode: "NEW" | "EDIT" | "VIEW" | "UPLOAD" | null;
  name: string | null;
  relevantId?: number | string | undefined | null;
}
export interface ISnackbarProps {
  message: string;
  type: AlertColor;
  open: boolean | undefined;
  setOpen: (status: boolean) => void;
}

export interface IConfirmDialogStates {
  isOpen: boolean;
  title: string;
  description: string;
  confirmBtnLabel: string;
  cancelBtnLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}
export interface IConfirmDialogProps extends IConfirmDialogStates {
  onClose: () => void;
}
export interface IAlertDialogStates {
  isOpen: boolean;
  type: "ERROR" | "SUCCESS" | null;
  description: string;
  hasPrintBtn: boolean;
  hasExportBtn: boolean;
  data?: {
    date: string | null;
    fromAccount: string | null;
    toAccount: string | null;
    amount: string | null;
    reference: string | null;
  };
}
export interface IAlertDialogProps extends IAlertDialogStates {
  onClose: () => void;
}

export interface ISnackbarState {
  message: string | undefined;
  type: AlertColor | undefined;
  isOpen: boolean;
}

export interface DialogProps {
  open: boolean;
  handleClose: (value?: any) => void;
  handleAction?: (value?: any) => void;
}

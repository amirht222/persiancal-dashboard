import React from "react";
import { ConfirmDialog } from "../contexts/ConfirmDialogContext";
export default function useConfirm() {
  return React.useContext(ConfirmDialog);
}

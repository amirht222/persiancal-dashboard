import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { DialogProps } from "../../../constants/GlobalTypes";

import { zodResolver } from "@hookform/resolvers/zod";
import CheckIcon from "@mui/icons-material/Check";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSnackbar from "../../../hooks/useSnackbar";
import instance from "../../../utils/axiosInstance";

const AddNewLabDialog = (props: DialogProps) => {
  const { showSnack } = useSnackbar();

  const addLabSchema = z.object({
    name: z.string().min(1, "نام آزمایشگاه الزامیست"),
    description: z.string().min(1, "متن توضیحات الزامیست"),
  });
  type addLabInputs = z.infer<typeof addLabSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<addLabInputs>({
    resolver: zodResolver(addLabSchema),
    mode: "onSubmit",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: addLabInputs) => {
      return instance.post("lab", {
        ...data,
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "آزمایشگاه با موفقیت ثبت شد",
      });
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      props.handleClose();
      reset();
    },
    onError(error) {
      showSnack({
        type: "error",
        message: error.message || "خطایی رخ داده. لطفا مجددا تلاش کنید",
      });
    },
  });

  const onSubmitHandler = (values: addLabInputs) => {
    mutation.mutate(values);
  };

  const closeDialogHandler = async () => {
    props.handleClose();
    reset();
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={closeDialogHandler}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 700 }}>افزودن آزمایشگاه</Typography>
          <Box onClick={closeDialogHandler} sx={{ cursor: "pointer" }}>
            <ClearIcon />
          </Box>
        </DialogTitle>
        <DialogContent aria-label="dialog-description">
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
          >
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="lab-name"
              label={"نام آزمایشگاه"}
              error={!!errors["name"]}
              helperText={errors["name"] ? errors["name"].message : ""}
              {...register("name")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              multiline
              minRows={2}
              id="lab-description"
              label={"متن توضیحات"}
              error={!!errors["description"]}
              helperText={
                errors["description"] ? errors["description"].message : ""
              }
              {...register("description")}
            />

            <DialogActions sx={{ justifyContent: "center", pt: 3, gap: 1 }}>
              <Button
                onClick={props.handleAction}
                variant="outlined"
                color="success"
                type="submit"
                disabled={mutation.isPending}
                startIcon={
                  mutation.isPending ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : (
                    <CheckIcon />
                  )
                }
              >
                ثبت
              </Button>
              <Button
                onClick={closeDialogHandler}
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
              >
                لغو
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewLabDialog;
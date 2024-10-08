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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import { useState } from "react";

const AddActivityDialog = (props: DialogProps) => {
  const { showSnack } = useSnackbar();

  const [image, setImage] = useState<any>();
  const addActivitySchema = z.object({
    text: z.string().min(1, "متن فعالیت الزامیست"),
    providerTitle: z.string().min(1, "نام شرکت الزامیست"),
  });
  type addActivityInputs = z.infer<typeof addActivitySchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<addActivityInputs>({
    resolver: zodResolver(addActivitySchema),
    mode: "onSubmit",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: addActivityInputs) => {
      const fd = new FormData();
      fd.append("text", data.text);
      fd.append("providerTitle", data.providerTitle);
      if (image) fd.append(`image`, image);

      return instance.post("activity", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "فعالیت با موفقیت ثبت شد",
      });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
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

  const onSubmitHandler = (values: addActivityInputs) => {
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
          <Typography sx={{ fontWeight: 700 }}>افزودن فعالیت</Typography>
          <Box onClick={closeDialogHandler} sx={{ cursor: "pointer" }}>
            <ClearIcon />
          </Box>
        </DialogTitle>
        <DialogContent aria-label="dialog-description">
          <Typography>عکس فعالیت</Typography>
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files?.[0]);
            }}
          />
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
          >
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="activity-text"
              label={"متن فعالیت"}
              error={!!errors["text"]}
              helperText={errors["text"] ? errors["text"].message : ""}
              {...register("text")}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>شرکت</InputLabel>
              <Select
                defaultValue={""}
                label={"شرکت"}
                {...register("providerTitle")}
              >
                <MenuItem value={"persia"}>پرشیا آزما</MenuItem>
                <MenuItem value={"datis"}>داتیس</MenuItem>
              </Select>
            </FormControl>

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

export default AddActivityDialog;

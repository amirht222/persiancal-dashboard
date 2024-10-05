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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSnackbar from "../../../hooks/useSnackbar";
import instance from "../../../utils/axiosInstance";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";

const AddNewConsultationDialog = (props: DialogProps) => {
  const { showSnack } = useSnackbar();

  const [image, setImage] = useState<any>();
  const [attachment, setAttachment] = useState<any>();

  const addConsultationSchema = z.object({
    title: z.string().min(1, "نام دوره الزامیست"),
    provider: z.string().min(1, "نام شرکت الزامیست"),
    description: z.string().min(1, "متن توضیحات دوره الزامیست"),
  });
  type addConsultationInputs = z.infer<typeof addConsultationSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<addConsultationInputs>({
    resolver: zodResolver(addConsultationSchema),
    mode: "onSubmit",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: addConsultationInputs) => {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("provider", data.provider);
      fd.append("description", data.description);
      if (image) fd.append("image", image);
      if (attachment) fd.append("attachment", attachment);

      return instance.post("consultation", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "مشاوره با موفقیت ثبت شد",
      });
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
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

  const onSubmitHandler = (values: addConsultationInputs) => {
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
          <Typography sx={{ fontWeight: 700 }}>افزودن خدمت مشاوره</Typography>
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
            <Typography>عکس مشاوره</Typography>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files?.[0]);
              }}
            />

            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="consultation-title"
              label={"نام خدمت مشاوره"}
              error={!!errors["title"]}
              helperText={errors["title"] ? errors["title"].message : ""}
              {...register("title")}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>شرکت</InputLabel>
              <Select
                defaultValue={""}
                label={"شرکت"}
                {...register("provider")}
              >
                <MenuItem value={"persia"}>پرشیا آزما</MenuItem>
                <MenuItem value={"datis"}>داتیس</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="user-address"
              multiline
              minRows={2}
              label={"توضیحات"}
              error={!!errors["description"]}
              helperText={
                errors["description"] ? errors["description"].message : ""
              }
              {...register("description")}
            />
            <Typography>پیوست مشاوره</Typography>
            <input
              type="file"
              onChange={(e) => {
                setAttachment(e.target.files?.[0]);
              }}
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

export default AddNewConsultationDialog;

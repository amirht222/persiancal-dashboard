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

const AddArticleDialog = (props: DialogProps) => {
  const { showSnack } = useSnackbar();

  const [attachment, setAttachment] = useState<any>();
  const addArticleSchema = z.object({
    title: z.string().min(1, "نام مقاله الزامیست"),
    text: z.string().min(1, "متن مقاله الزامیست"),
    provider: z.string().min(1, "نام شرکت الزامیست"),
  });
  type addArticleInputs = z.infer<typeof addArticleSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<addArticleInputs>({
    resolver: zodResolver(addArticleSchema),
    mode: "onSubmit",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: addArticleInputs) => {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("text", data.text);
      fd.append("provider", data.provider);
      if (attachment) fd.append(`attachment`, attachment);
      return instance.post("article", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "مقاله با موفقیت ثبت شد",
      });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
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

  const onSubmitHandler = (values: addArticleInputs) => {
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
          <Typography sx={{ fontWeight: 700 }}>افزودن مقاله</Typography>
          <Box onClick={closeDialogHandler} sx={{ cursor: "pointer" }}>
            <ClearIcon />
          </Box>
        </DialogTitle>
        <DialogContent aria-label="dialog-description">
          <Typography>پیوست مقاله</Typography>
          <input
            type="file"
            onChange={(e) => {
              setAttachment(e.target.files?.[0]);
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
              id="article-name"
              label={"نام مقاله"}
              error={!!errors["title"]}
              helperText={errors["title"] ? errors["title"].message : ""}
              {...register("title")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              multiline
              minRows={2}
              id="article-text"
              label={"متن مقاله"}
              error={!!errors["text"]}
              helperText={errors["text"] ? errors["text"].message : ""}
              {...register("text")}
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

export default AddArticleDialog;

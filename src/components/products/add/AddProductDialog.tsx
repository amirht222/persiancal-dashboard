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
import { useState } from "react";

const AddProductDialog = (props: DialogProps) => {
  const { showSnack } = useSnackbar();

  const [files, setFiles] = useState<any>();
  const addProductSchema = z.object({
    title: z.string().min(1, "نام محصول الزامیست"),
    price: z.string().min(1, "نام محصول الزامیست"),
    description: z.string().min(1, "متن توضیحات الزامیست"),
  });
  type addProductInputs = z.infer<typeof addProductSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<addProductInputs>({
    resolver: zodResolver(addProductSchema),
    mode: "onSubmit",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: addProductInputs) => {
      const fd = new FormData();
      fd.append("price", data.price);
      fd.append("description", data.description);
      fd.append("title", data.title);
      for(let i = 0; i < files.length; i++){
        fd.append(`files${i+1}`, files[i]);
      }
            
      return instance.post("product", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "محصول با موفقیت ثبت شد",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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

  const onSubmitHandler = (values: addProductInputs) => {
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
          <Typography sx={{ fontWeight: 700 }}>افزودن محصول</Typography>
          <Box onClick={closeDialogHandler} sx={{ cursor: "pointer" }}>
            <ClearIcon />
          </Box>
        </DialogTitle>
        <DialogContent aria-label="dialog-description">
          <input
            multiple
            type="file"
            onChange={(e) => {
              setFiles(e.target.files);
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
              id="product-name"
              label={"نام محصول"}
              error={!!errors["title"]}
              helperText={errors["title"] ? errors["title"].message : ""}
              {...register("title")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="product-price"
              label={"قیمت"}
              error={!!errors["price"]}
              helperText={errors["price"] ? errors["price"].message : ""}
              {...register("price")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              multiline
              minRows={2}
              id="product-description"
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

export default AddProductDialog;

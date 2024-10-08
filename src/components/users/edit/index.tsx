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
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import CryptoJS from "crypto-js";
import { DialogProps } from "../../../constants/GlobalTypes";

import { zodResolver } from "@hookform/resolvers/zod";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSnackbar from "../../../hooks/useSnackbar";
import instance from "../../../utils/axiosInstance";

interface Props extends DialogProps {
  data: any;
}

const EditUserDialog = (props: Props) => {
  const { showSnack } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editUserSchema = z.object({
    username: z.string().min(1, "نام کاربری الزامیست"),
    name: z.string().min(1, "نام الزامیست"),
    email: z.string().min(1, "ایمیل الزامیست"),
    password: z.string(),
    address: z
      .string()
      .min(1, "آدرس الزامیست")
      .max(40, "آدرس باید کمتر از چهل کاراکتر باشد"),
  });
  type editUserInputs = z.infer<typeof editUserSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<editUserInputs>({
    resolver: zodResolver(editUserSchema),
    mode: "onSubmit",
    defaultValues: {
      username: props.data.username,
      name: props.data.name,
      email: props.data.email,
      password: "",
      address: props.data.address,
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: editUserInputs) => {
      return instance.put("user", {
        ...data,
        password: data.password
          ? CryptoJS.SHA256(data.password).toString()
          : null,
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "کاربر با موفقیت تغییر کرد",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
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

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("username", props.data.username);
      formData.append("file", file);

      return instance.post("user/addFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "فایل با موفقیت آپلود شد",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      props.handleClose();
    },
    onError(error) {
      showSnack({
        type: "error",
        message: error.message || "آپلود فایل با خطا مواجه شد",
      });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: (userFileUrl: string) => {
      return instance.post(`user/deleteFile`, { userFileUrl });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "فایل با موفقیت حذف شد",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      props.handleClose();
    },
    onError(error) {
      showSnack({
        type: "error",
        message: error.message || "حذف فایل با خطا مواجه شد",
      });
    },
  });

  const onSubmitHandler = (values: editUserInputs) => {
    mutation.mutate(values);
  };

  const closeDialogHandler = async () => {
    props.handleClose();
    reset();
  };
  const handleAddFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFileMutation.mutate(file); // Call the mutation to upload the image
    }
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
          <Typography sx={{ fontWeight: 700 }}>تغییر کاربر</Typography>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>فایل های مربوط به کاربر</Typography>
              <Button onClick={handleAddFileClick}>افزودن فایل</Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the file input
                onChange={handleFileInputChange} // Handle file selection
              />
            </Box>
            <List>
              {props.data.userFiles.map(
                (file: { userFileUrl: string; userUsername: string }) => (
                  <ListItem
                    secondaryAction={
                      <IconButton
                        onClick={() =>
                          deleteFileMutation.mutate(file.userFileUrl)
                        }
                        color="error"
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemText primary={file.userFileUrl} />
                  </ListItem>
                )
              )}
            </List>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <Box sx={{ flexBasis: "50%" }}>
                <TextField
                  type="text"
                  margin="normal"
                  fullWidth
                  id="user-username"
                  label={"نام کاربری"}
                  error={!!errors["username"]}
                  helperText={
                    errors["username"] ? errors["username"].message : ""
                  }
                  {...register("username")}
                />
                <TextField
                  type="text"
                  margin="normal"
                  fullWidth
                  id="user-name"
                  label={"نام"}
                  error={!!errors["name"]}
                  helperText={errors["name"] ? errors["name"].message : ""}
                  {...register("name")}
                />
                <TextField
                  type="text"
                  margin="normal"
                  fullWidth
                  id="user-email"
                  label={"ایمیل"}
                  error={!!errors["email"]}
                  helperText={errors["email"] ? errors["email"].message : ""}
                  {...register("email")}
                />
              </Box>
              <Box sx={{ flexBasis: "50%" }}>
                <TextField
                  type="text"
                  margin="normal"
                  fullWidth
                  id="user-password"
                  label={"رمز عبور"}
                  error={!!errors["password"]}
                  helperText={
                    errors["password"] ? errors["password"].message : ""
                  }
                  {...register("password")}
                />
                <TextField
                  type="text"
                  margin="normal"
                  fullWidth
                  id="user-address"
                  multiline
                  minRows={2}
                  label={"آدرس"}
                  error={!!errors["address"]}
                  helperText={
                    errors["address"] ? errors["address"].message : ""
                  }
                  {...register("address")}
                />
              </Box>
            </Box>

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

export default EditUserDialog;

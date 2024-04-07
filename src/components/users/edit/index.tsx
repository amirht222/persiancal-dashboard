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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSnackbar from "../../../hooks/useSnackbar";
import instance from "../../../utils/axiosInstance";
import CheckIcon from "@mui/icons-material/Check";

interface Props extends DialogProps {
  data: any;
}

const EditUserDialog = (props: Props) => {
  console.log(props);

  const { showSnack } = useSnackbar();

  const editUserSchema = z.object({
    username: z.string().min(1, "نام کاربری الزامیست"),
    name: z.string().min(1, "نام الزامیست"),
    email: z.string().min(1, "ایمیل الزامیست"),
    // password: z.string().min(1, "رمز عبور الزامیست"),
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
      //   password: "",
      address: props.data.address,
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: editUserInputs) => {
      return instance.put("user", {
        ...data,
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

  const onSubmitHandler = (values: editUserInputs) => {
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
                {/* <TextField
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
                /> */}
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

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
  Typography
} from "@mui/material";
import { DialogProps } from "../../../constants/GlobalTypes";

import { zodResolver } from "@hookform/resolvers/zod";
import CheckIcon from "@mui/icons-material/Check";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSnackbar from "../../../hooks/useSnackbar";
import instance from "../../../utils/axiosInstance";

interface Props extends DialogProps {
  data: any;
}

const EditProviderDialog = (props: Props) => {
  const { showSnack } = useSnackbar();

  const editProviderSchema = z.object({
    telephone: z.string().min(1, "شماره الزامیست"),
    fax: z.string(),
    email: z.string().min(1, "ایمیل الزامیست"),
    address: z.string().min(1, "آدرس الزامیست"),
    aboutUs: z.string().min(1, "درباره ما الزامیست"),
  });
  type editProviderInputs = z.infer<typeof editProviderSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<editProviderInputs>({
    resolver: zodResolver(editProviderSchema),
    mode: "onSubmit",
    defaultValues: {
      telephone: props.data.telephone,
      fax: props.data.fax,
      email: props.data.email,
      address: props.data.address,
      aboutUs: props.data.aboutUs,
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: editProviderInputs) => {
      return instance.put("provider", {
        providerTitle: props.data.providerTitle,
        ...data,
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "اطلاعات با موفقیت تغییر کرد",
      });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
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

  const onSubmitHandler = (values: editProviderInputs) => {
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
          <Typography sx={{ fontWeight: 700 }}>
            تغییر اطلاعات شرکت {props.data.provider}
          </Typography>
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
              id="provider-telephone"
              label={"شماره تلفن"}
              error={!!errors["telephone"]}
              helperText={
                errors["telephone"] ? errors["telephone"].message : ""
              }
              {...register("telephone")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="provider-fax"
              label={"فکس"}
              error={!!errors["fax"]}
              helperText={errors["fax"] ? errors["fax"].message : ""}
              {...register("fax")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="provider-email"
              label={"ایمیل"}
              error={!!errors["email"]}
              helperText={errors["email"] ? errors["email"].message : ""}
              {...register("email")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="provider-address"
              label={"آدرس"}
              error={!!errors["address"]}
              helperText={errors["address"] ? errors["address"].message : ""}
              {...register("address")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              multiline
              minRows={2}
              id="provider-aboutUs"
              label={"درباره شرکت"}
              error={!!errors["aboutUs"]}
              helperText={errors["aboutUs"] ? errors["aboutUs"].message : ""}
              {...register("aboutUs")}
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

export default EditProviderDialog;

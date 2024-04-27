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

interface Props extends DialogProps {
  data: any;
}

const EditCourseDialog = (props: Props) => {
  const { showSnack } = useSnackbar();

  const editCourseSchema = z.object({
    title: z.string().min(1, "نام دوره الزامیست"),
    provider: z.string().min(1, "شرکت الزامیست"),
    description: z.string().min(1, "توضیحات الزامیست"),
  });
  type editCourseInputs = z.infer<typeof editCourseSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<editCourseInputs>({
    resolver: zodResolver(editCourseSchema),
    mode: "onSubmit",
    defaultValues: {
      title: props.data.title,
      provider: props.data.provider,
      description: props.data.description,
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: editCourseInputs) => {
      return instance.put("course", {
        ...data,
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "دوره با موفقیت تغییر کرد",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
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

  const onSubmitHandler = (values: editCourseInputs) => {
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
          <Typography sx={{ fontWeight: 700 }}>تغییر دوره</Typography>
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
              id="course-title"
              label={"نام دوره"}
              error={!!errors["title"]}
              helperText={errors["title"] ? errors["title"].message : ""}
              {...register("title")}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>شرکت</InputLabel>
              <Select
                defaultValue={props.data.provider}
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
              id="course-description"
              multiline
              minRows={2}
              label={"توضیحات"}
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

export default EditCourseDialog;

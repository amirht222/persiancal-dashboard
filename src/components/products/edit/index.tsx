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
  Grid,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DialogProps } from "../../../constants/GlobalTypes";
import CryptoJS from "crypto-js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSnackbar from "../../../hooks/useSnackbar";
import instance from "../../../utils/axiosInstance";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef } from "react"; // Import useRef to handle file input
const base_url = import.meta.env.VITE_BASE_URL;

interface Props extends DialogProps {
  data: any;
}

const EditProductDialog = (props: Props) => {
  const { showSnack } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to the file input

  const editProductSchema = z.object({
    title: z.string().min(1, "نام محصول الزامیست"),
    description: z.string(),
    provider: z.string().min(1, "نام شرکت الزامیست"),
  });
  type editProductInputs = z.infer<typeof editProductSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<editProductInputs>({
    resolver: zodResolver(editProductSchema),
    mode: "onSubmit",
    defaultValues: {
      title: props.data.title,
      description: props.data.description,
      provider: props.data.provider,
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: editProductInputs) => {
      return instance.put("product", {
        ...data,
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "محصول با موفقیت تغییر کرد",
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

  const uploadImageMutation = useMutation({
    mutationFn: (imageFile: File) => {
      const formData = new FormData();
      formData.append("id", props.data.id);
      formData.append("image", imageFile);

      return instance.post("product/addImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "عکس با موفقیت آپلود شد",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      props.handleClose();
    },
    onError(error) {
      showSnack({
        type: "error",
        message: error.message || "آپلود عکس با خطا مواجه شد",
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageUrl: string) => {
      return instance.post(`product/deleteImage`, { imageUrl });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "عکس با موفقیت حذف شد",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      props.handleClose();
    },
    onError(error) {
      showSnack({
        type: "error",
        message: error.message || "حذف عکس با خطا مواجه شد",
      });
    },
  });

  const onSubmitHandler = (values: editProductInputs) => {
    mutation.mutate(values);
  };

  const closeDialogHandler = async () => {
    props.handleClose();
    reset();
  };

  // Function to trigger the file input when the button is clicked
  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change to upload the selected image
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file); // Call the mutation to upload the image
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
          <Typography sx={{ fontWeight: 700 }}>تغییر محصول</Typography>
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
              <Typography>عکس های محصول</Typography>
              <Button onClick={handleAddImageClick}>افزودن عکس جدید</Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the file input
                onChange={handleFileInputChange} // Handle file selection
              />
            </Box>
            <Grid container spacing={1} mt={2}>
              {props.data.images.map((image: { imageUrl: string }) => (
                <Grid
                  item
                  xs={3}
                  sx={{ position: "relative" }}
                  key={image.imageUrl}
                >
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "-10px",
                      left: "-10px",
                      background: "#ccc",
                    }}
                    color="error"
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteImageMutation.mutate(image.imageUrl)} // Call mutation on delete
                  >
                    <DeleteIcon />
                  </IconButton>
                  <img
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    src={
                      image.imageUrl
                        ? `${base_url}/${image.imageUrl}`
                        : undefined
                    }
                    alt="activity image"
                  />
                </Grid>
              ))}
            </Grid>

            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="product-title"
              label={"نام محصول"}
              error={!!errors["title"]}
              helperText={errors["title"] ? errors["title"].message : ""}
              {...register("title")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="product-description"
              label={"توضیحات"}
              error={!!errors["description"]}
              helperText={
                errors["description"] ? errors["description"].message : ""
              }
              {...register("description")}
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

export default EditProductDialog;

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
  Grid,
  IconButton,
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
import { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill"; // Import Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
const base_url = import.meta.env.VITE_BASE_URL;

interface Props extends DialogProps {
  data: any;
}

const EditLabDialog = (props: Props) => {
  const { showSnack } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [description, setDescription] = useState(props.data.description);

  const editLabSchema = z.object({
    name: z.string().min(1, "نام الزامیست"),
  });
  type editLabInputs = z.infer<typeof editLabSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<editLabInputs>({
    resolver: zodResolver(editLabSchema),
    mode: "onSubmit",
    defaultValues: {
      name: props.data.name,
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: editLabInputs) => {
      return instance.put("lab", {
        id: props.data.id,
        description,
        ...data,
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "آزمایشگاه با موفقیت تغییر کرد",
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

  const uploadImageMutation = useMutation({
    mutationFn: (imageFile: File) => {
      const formData = new FormData();
      formData.append("id", props.data.id);
      formData.append("image", imageFile);

      return instance.post("lab/addImage", formData, {
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
      queryClient.invalidateQueries({ queryKey: ["labs"] });
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
      return instance.post(`lab/deleteImage`, { imageUrl });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "عکس با موفقیت حذف شد",
      });
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      props.handleClose();
    },
    onError(error) {
      showSnack({
        type: "error",
        message: error.message || "حذف عکس با خطا مواجه شد",
      });
    },
  });

  const onSubmitHandler = (values: editLabInputs) => {
    mutation.mutate(values);
  };

  const closeDialogHandler = async () => {
    props.handleClose();
    reset();
  };

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
          <Typography sx={{ fontWeight: 700 }}>تغییر آزمایشگاه</Typography>
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
              <Typography>عکس های آزمایشگاه</Typography>
              <Button onClick={handleAddImageClick}>افزودن عکس جدید</Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the file input
                onChange={handleFileInputChange} // Handle file selection
              />
            </Box>
            <Grid container spacing={1} mt={2}>
              {props.data.labImages?.map((image: { imageUrl: string }) => (
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
                    alt="lab image"
                  />
                </Grid>
              ))}
            </Grid>

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
            <div style={{ direction: "rtl" }}>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    ["link", "image"],
                    ["clean"],
                    [
                      { align: "" },
                      { align: "center" },
                      { align: "right" },
                      { align: "justify" },
                    ],
                  ],
                }}
                formats={[
                  "font",
                  "size",
                  "color",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                  "video",
                  "align",
                ]}
              />
            </div>

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

export default EditLabDialog;

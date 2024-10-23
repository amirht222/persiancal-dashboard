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
import ReactQuill from "react-quill"; // Import Quill
import "react-quill/dist/quill.snow.css";

const AddNewCourseDialog = (props: DialogProps) => {
  const { showSnack } = useSnackbar();

  const [description, setDescription] = useState("");

  const [image, setImage] = useState<any>();
  const [attachment, setAttachment] = useState<any>();

  const addCourseSchema = z.object({
    title: z.string().min(1, "نام دوره الزامیست"),
    provider: z.string().min(1, "نام شرکت الزامیست"),
    // description: z.string().min(1, "متن توضیحات دوره الزامیست"),
    duration: z.string().min(1, "مدت زمان دوره الزامیست"),
  });
  type addCourseInputs = z.infer<typeof addCourseSchema>;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<addCourseInputs>({
    resolver: zodResolver(addCourseSchema),
    mode: "onSubmit",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: addCourseInputs) => {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("provider", data.provider);
      fd.append("duration", data.duration);
      fd.append("description", description);
      if (image) fd.append("image", image);
      if (attachment) fd.append("attachment", attachment);

      return instance.post("course", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess() {
      showSnack({
        type: "success",
        message: "دوره با موفقیت ثبت شد",
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

  const onSubmitHandler = (values: addCourseInputs) => {
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
          <Typography sx={{ fontWeight: 700 }}>افزودن دوره</Typography>
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
            <Typography>عکس دوره</Typography>
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
              id="course-title"
              label={"نام دوره"}
              error={!!errors["title"]}
              helperText={errors["title"] ? errors["title"].message : ""}
              {...register("title")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="course-duration"
              label={"مدت زمان دوره به ساعت"}
              error={!!errors["duration"]}
              helperText={errors["duration"] ? errors["duration"].message : ""}
              {...register("duration")}
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
            {/* <TextField
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
            /> */}
            <div style={{ direction: "rtl", marginTop: "20px" }}>
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
            <Typography>پیوست دوره</Typography>
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

export default AddNewCourseDialog;

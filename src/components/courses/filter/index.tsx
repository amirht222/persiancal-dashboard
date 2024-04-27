import { DialogProps } from "../../../constants/GlobalTypes";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
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

import { zodResolver } from "@hookform/resolvers/zod";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CourseFilterDialogProps extends DialogProps {
  filterHandler: (value: any) => void;
}

const FilterCoursesDialog = (props: CourseFilterDialogProps) => {
  const filterCourseSchema = z.object({
    title: z.string(),
    provider: z.string(),
  });
  type filterCourse = z.infer<typeof filterCourseSchema>;
  const { register, handleSubmit, reset } = useForm<filterCourse>({
    resolver: zodResolver(filterCourseSchema),
    mode: "onSubmit",
  });

  const onSubmitHandler = async (values: filterCourse) => {
    props.filterHandler(values);
    props.handleClose();
    reset();
  };

  const closeDialogHandler = async () => {
    props.handleClose();
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={closeDialogHandler}
        fullWidth
        maxWidth={"xs"}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 700 }}>فیلتر بر اساس</Typography>
          <Box onClick={closeDialogHandler} sx={{ cursor: "pointer" }}>
            <ClearIcon />
          </Box>
        </DialogTitle>
        <DialogContent aria-label="user-filter">
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
              {...register("title")}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>شرکت</InputLabel>
              <Select
                defaultValue={""}
                label={"شرکت"}
                {...register("provider")}
              >
                <MenuItem value={"persia"}>پرشیا</MenuItem>
                <MenuItem value={"datis"}>داتیس</MenuItem>
              </Select>
            </FormControl>

            <DialogActions sx={{ justifyContent: "center", pt: 3, gap: 1 }}>
              <Button
                variant="outlined"
                type="submit"
                startIcon={<FilterListIcon />}
              >
                فیلتر
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterCoursesDialog;

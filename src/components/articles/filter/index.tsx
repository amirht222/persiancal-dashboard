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
import { DialogProps } from "../../../constants/GlobalTypes";

import { zodResolver } from "@hookform/resolvers/zod";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ArticleFilterDialogProps extends DialogProps {
  filterHandler: (value: any) => void;
}

const FilterArticlesDialog = (props: ArticleFilterDialogProps) => {
  const filterArticleSchema = z.object({
    title: z.string(),
    provider: z.string(),
  });
  type filterArticle = z.infer<typeof filterArticleSchema>;
  const { register, handleSubmit, reset } = useForm<filterArticle>({
    resolver: zodResolver(filterArticleSchema),
    mode: "onSubmit",
  });

  const onSubmitHandler = async (values: filterArticle) => {
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
              id="article-title"
              label={"عنوان مقاله"}
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

            {/* <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>وضعیت</InputLabel>
              <Select
                defaultValue={""}
                label={"وضعیت آزمایشگاه"}
                {...register("labStatus")}
              >
                <MenuItem value={"1"}>فعال</MenuItem>
                <MenuItem value={"2"}>حذف</MenuItem>
              </Select>
            </FormControl> */}

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

export default FilterArticlesDialog;

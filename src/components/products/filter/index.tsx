import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import { DialogProps } from "../../../constants/GlobalTypes";

import { zodResolver } from "@hookform/resolvers/zod";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProductFilterDialogProps extends DialogProps {
  filterHandler: (value: any) => void;
}

const FilterProductsDialog = (props: ProductFilterDialogProps) => {
  const filterProductSchema = z.object({
    title: z.string(),
    price: z.string(),
  });
  type filterProduct = z.infer<typeof filterProductSchema>;
  const { register, handleSubmit, reset } = useForm<filterProduct>({
    resolver: zodResolver(filterProductSchema),
    mode: "onSubmit",
  });

  const onSubmitHandler = async (values: filterProduct) => {
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
              id="product-title"
              label={"نام محصول"}
              {...register("title")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="product-price"
              label={"قیمت"}
              {...register("price")}
            />

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

export default FilterProductsDialog;

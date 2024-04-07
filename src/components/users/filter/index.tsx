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

interface UserFilterDialogProps extends DialogProps {
  filterHandler: (value: any) => void;
}

const FilterUsersDialog = (props: UserFilterDialogProps) => {
  const filterUserSchema = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string(),
    userStatus: z.string(),
  });
  type filterUser = z.infer<typeof filterUserSchema>;
  const { register, handleSubmit, reset } = useForm<filterUser>({
    resolver: zodResolver(filterUserSchema),
    mode: "onSubmit",
  });

  const onSubmitHandler = async (values: filterUser) => {
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
              id="user-name"
              label={"نام"}
              {...register("name")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="user-username"
              label={"نام کاربری"}
              {...register("username")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="user-email"
              label={"ایمیل"}
              {...register("email")}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>وضعیت</InputLabel>
              <Select
                defaultValue={""}
                label={"وضعیت کاربر"}
                {...register("userStatus")}
              >
                <MenuItem value={"1"}>در انتظار</MenuItem>
                <MenuItem value={"2"}>فعال</MenuItem>
                <MenuItem value={"3"}>مسدود</MenuItem>
                <MenuItem value={"4"}>حذف</MenuItem>
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

export default FilterUsersDialog;

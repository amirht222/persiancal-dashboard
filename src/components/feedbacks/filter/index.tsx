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

interface FeedbackFilterDialogProps extends DialogProps {
  filterHandler: (value: any) => void;
}

const FilterFeedbacksDialog = (props: FeedbackFilterDialogProps) => {
  const filterFeedbackSchema = z.object({
    senderName: z.string(),
    companyName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
  });
  type filterFeedback = z.infer<typeof filterFeedbackSchema>;
  const { register, handleSubmit, reset } = useForm<filterFeedback>({
    resolver: zodResolver(filterFeedbackSchema),
    mode: "onSubmit",
  });

  const onSubmitHandler = async (values: filterFeedback) => {
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
        <DialogContent aria-label="feedback-filter">
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
          >
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="feedback-sender-name"
              label={"نام فرستنده"}
              {...register("senderName")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="feedback-company-username"
              label={"نام سازمان"}
              {...register("companyName")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="feedback-sender-email"
              label={"ایمیل"}
              {...register("email")}
            />
            <TextField
              type="text"
              margin="normal"
              fullWidth
              id="feedback-sender-email"
              label={"شماره تماس"}
              {...register("phoneNumber")}
            />


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

export default FilterFeedbacksDialog;

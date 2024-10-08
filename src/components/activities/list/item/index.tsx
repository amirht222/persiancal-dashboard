import {
  IconButton,
  ListItem,
  ListItemText,
  useTheme
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useConfirm from "../../../../hooks/useConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import instance from "../../../../utils/axiosInstance";
import { providerMapper } from "../../../../utils/utils";
const base_url = import.meta.env.VITE_BASE_URL;

type ActivityItemProps = {
  id: string;
  text: string;
  imagePath?: string;
  providerTitle: string;
};

const ActivityItem = (props: ActivityItemProps) => {
  const theme = useTheme();
  const { openConfirm, closeConfirm } = useConfirm();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => {
      return instance.delete(`activity/${props.id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      showSnack({
        type: "success",
        message: "فعالیت با موفقیت حذف شد",
      });
    },
    onError(error) {
      showSnack({
        type: "error",
        message:
          error.message || "حذف فعالیت با خطا مواجه شد. لطفا مجددا تلاش کنید",
      });
    },
  });

  const deleteActivityHandler = () => {
    openConfirm({
      title: "حذف فعالیت",
      description: "آیا از حذف فعالیت اطمینان دارید؟",
      isOpen: true,
      cancelBtnLabel: "لغو",
      confirmBtnLabel: "حذف",
      onCancel: () => closeConfirm(),
      onConfirm: async () => {
        closeConfirm();
        deleteMutate();
      },
    });
  };
  return (
    <>
      <ListItem
        sx={{
          background: theme.palette.secondary.light,
          borderRadius: "20px",
          p: 2,
          my: 2,
        }}
        secondaryAction={
          <IconButton
            onClick={deleteActivityHandler}
            edge="end"
            aria-label="delete"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <img
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            marginLeft: "10px",
          }}
          src={props.imagePath ? `${base_url}/${props.imagePath}` : undefined}
          alt="activity image"
        />
        <ListItemText
          primary={`متن فعالیت: ${props.text}`}
          secondary={`شرکت: ${providerMapper(props.providerTitle)}`}
        />
      </ListItem>
    </>
  );
};

export default ActivityItem;

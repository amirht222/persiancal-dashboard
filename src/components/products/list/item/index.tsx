import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useConfirm from "../../../../hooks/useConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import instance from "../../../../utils/axiosInstance";
import { BASE_URL } from "../../../../constants";

type ProductItemProps = {
  id: string;
  title: string;
  images: any[];
};

const ProductItem = (props: ProductItemProps) => {
  console.log(props);

  const { openConfirm, closeConfirm } = useConfirm();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => {
      return instance.delete(`product/${props.id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSnack({
        type: "success",
        message: "تجهیز با موفقیت حذف شد",
      });
    },
    onError(error) {
      showSnack({
        type: "error",
        message:
          error.message || "حذف تجهیز با خطا مواجه شد. لطفا مجددا تلاش کنید",
      });
    },
  });

  const deleteProductHandler = () => {
    openConfirm({
      title: "حذف تجهیز",
      description: "آیا از حذف تجهیز اطمینان دارید؟",
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
      <Box
        sx={{
          boxShadow:
            "4px 4px 8px 0px rgba(0, 0, 0, 0.1),-4px -1px 8px 0px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
          padding: "15px 20px",
        }}
      >
        <Stack direction={"column"} gap={2}>
          <Box display={"flex"} justifyContent={"center"}>
            <Avatar
              alt="Plugin Logo"
              src={
                props.images
                  ? `${BASE_URL}/${props.images[0]?.imageUrl}`
                  : undefined
              }
              sx={{
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.25)",
                borderRadius: "8px",
                width: 80,
                height: 80,
                marginTop: -7,
              }}
              variant="square"
            />
          </Box>
          <Typography textAlign={"center"} component="p" fontWeight={"bold"}>
            {props.title}
          </Typography>
          <Typography textAlign={"center"} component="p" fontSize={14}>
            قیمت: تماس بگیرید
          </Typography>
          <Stack direction="row" justifyContent={"end"}>
            <Tooltip title="تغییر" arrow={true} placement="bottom">
              <IconButton onClick={() => {}}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="حذف" arrow={true} placement="bottom">
              <IconButton onClick={deleteProductHandler}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
      {/* {isEditProductDialogOpen && (
        <EditProductDialog
          data={{
            title: props.title,
            price: props.price,
            id: props.id,
          }}
          open={isEditProductDialogOpen}
          handleClose={() => setIsEditProductDialogOpen(false)}
        />
      )} */}
    </>
  );
};

export default ProductItem;

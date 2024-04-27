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

type ProductItemProps = {
  id: string;
  title: string;
  price: string;
  image: string;
};

const ProductItem = (props: ProductItemProps) => {
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
              src={props.image}
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
            قیمت: {props.price}
          </Typography>
          <Stack direction="row" justifyContent={"end"}>
            <Tooltip title="تغییر" arrow={true} placement="bottom">
              <IconButton onClick={() => {}}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="حذف" arrow={true} placement="bottom">
              <IconButton onClick={() => {}}>
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

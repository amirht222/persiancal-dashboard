import { Grid, Alert, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import ProductItem from "./item";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
}

const ProductList = (props: Props) => {
  if (props.isError) {
    return (
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Alert
            severity="error"
            sx={{ justifyContent: "center" }}
            icon={<ErrorIcon />}
            variant="filled"
          >
            دریافت اطلاعات با خطا مواجه شده است. لطفا دوباره تلاش کنید.
          </Alert>
        </Grid>
      </Grid>
    );
  }
  if (props.data && props.data?.data?.data?.length === 0) {
    return (
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Alert
            severity="warning"
            sx={{ justifyContent: "center" }}
            icon={<ErrorIcon />}
            variant="filled"
          >
            <Typography>محصولی یافت نشد</Typography>
          </Alert>
        </Grid>
      </Grid>
    );
  }
  return (
    <>
      <Grid container spacing={10}>
        {props.data &&
          props.data?.data?.data?.length > 0 &&
          props.data?.data?.data?.map((product: any) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={product.id}>
              <ProductItem
                id={product.id}
                title={product.title}
                images={product.productImages || undefined}
                provider={product.provider}
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default ProductList;

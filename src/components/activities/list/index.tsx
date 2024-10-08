import ErrorIcon from "@mui/icons-material/Error";
import { Alert, Grid, List, Typography } from "@mui/material";
import ActivityItem from "./item";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
}

const ActivitiesList = (props: Props) => {
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
            <Typography>فعالیتی یافت نشد</Typography>
          </Alert>
        </Grid>
      </Grid>
    );
  }
  return (
    <>
      <List>
        {props.data &&
          props.data?.data?.data?.length > 0 &&
          props.data?.data?.data?.map((activity: any) => (
            <ActivityItem
              key={activity.id}
              id={activity.id}
              text={activity.text}
              imagePath={activity.imagePath || undefined}
              providerTitle={activity.providerTitle}
            />
          ))}
      </List>
    </>
  );
};

export default ActivitiesList;

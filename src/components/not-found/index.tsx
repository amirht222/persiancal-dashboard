import { Box, Button, Typography } from "@mui/material";
import NotFoundImage from "../../assets/images/notfound.jpg";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={"20px"}
      >
        <Box>
          <Typography sx={{ fontSize: "60px", fontWeight: 700 }}>
            صفحه یافت نشد
          </Typography>
        </Box>
        <Box>
          <Button
            sx={{ px: "30px" }}
            variant="outlined"
            onClick={() => navigate("/")}
          >
            بازگشت به صفحه اصلی
          </Button>
        </Box>
      </Box>
      <Box>
        <img
          style={{ width: "800px", height: "500px", objectFit: "contain" }}
          src={NotFoundImage}
          alt="404"
        />
      </Box>
    </Box>
  );
};

export default NotFound;

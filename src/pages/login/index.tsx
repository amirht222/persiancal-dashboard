import { zodResolver } from "@hookform/resolvers/zod";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import LoginImage from "../../assets/images/login-image.svg";

const LoginPage = () => {
  const theme = useTheme();
  type formData = z.infer<typeof schema>;
  const schema = z.object({
    username: z.string().min(1, "نام کاربری الزامی میباشد"),
    password: z.string().min(1, "رمز عبور الزامی میباشد"),
  });
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<formData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const loginHandler = async (data: formData) => {
    try {
      console.log(data);
      // await login({ body: { ...data } });
      navigate("/", { replace: true });
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Box
      component={"main"}
      sx={{
        px: 25,
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContentL: "space-between",
        gap: "100px",
      }}
    >
      <Box
        sx={{
          flexBasis: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            borderRadius: 3,
            border: `3px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.common.white,
            px: 12,
            py: 12,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" textAlign={"center"}>
              به داشبورد پرشیا آزما خوش آمدید
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(loginHandler)}
              noValidate
            >
              <TextField
                margin="normal"
                fullWidth
                id="username"
                label="نام کاربری"
                autoComplete="off"
                InputProps={{
                  style: {
                    borderRadius: "30px",
                  },
                }}
                error={!!errors["username"]}
                helperText={
                  errors["username"] ? errors["username"].message : ""
                }
                {...register("username")}
                sx={{ mb: 3 }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="رمز عبور"
                type={isShowPassword ? "text" : "password"}
                id="password"
                autoComplete="off"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                      {isShowPassword ? (
                        <VisibilityIcon
                          onClick={() => setIsShowPassword(false)}
                        />
                      ) : (
                        <VisibilityOff
                          onClick={() => setIsShowPassword(true)}
                        />
                      )}
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: "30px",
                  },
                }}
                error={!!errors["password"]}
                helperText={
                  errors["password"] ? errors["password"].message : ""
                }
                {...register("password")}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ color: "white", mt: 10, borderRadius: "30px", px: 15 }}
                startIcon={<LoginIcon />}
                // startIcon={
                //   isLoading ? (
                //     <CircularProgress size={20} color="secondary" />
                //   ) : (
                //     <LoginIcon />
                //   )
                // }
              >
                ورود
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <img
        src={LoginImage}
        style={{
          flexBasis: "50%",
        }}
      />
    </Box>
  );
};

export default LoginPage;

import { zodResolver } from "@hookform/resolvers/zod";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  CircularProgress,
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
import { useMutation } from "@tanstack/react-query";
import instance from "../../utils/axiosInstance";
import useSnackbar from "../../hooks/useSnackbar";
import CryptoJS from 'crypto-js';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnack } = useSnackbar();

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

  const mutation = useMutation({
    mutationFn: (data: formData) => {
      const hashedPassword = CryptoJS.SHA256(data.password).toString();
      return instance.post(
        "auth/login",
        {
          username: data.username,
          password: hashedPassword,
        },
        {
          headers: {
            Authorization: undefined,
          },
        }
      );
    },
    onSuccess(res) {
      localStorage.setItem("accessToken", res.data.data);
      localStorage.setItem("role", res.data.role);
      navigate("/", { replace: true });
    },
    onError(error) {
      console.log(error);
      showSnack({
        type: "error",
        message: error.message || "خطایی رخ داده!",
      });
    },
  });

  const [isShowPassword, setIsShowPassword] = useState(false);

  const loginHandler = (data: formData) => {
    mutation.mutate({ ...data });
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
                disabled={mutation.isPending}
                startIcon={
                  mutation.isPending ? (
                    <CircularProgress size={20} color="primary" />
                  ) : (
                    <LoginIcon />
                  )
                }
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

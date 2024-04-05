import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const KChatAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  boxShadow: "none",
  color: "white",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 200,
    width: `calc(100% - ${200}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = (props: { open: boolean; toggleDrawer: () => void }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  // const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
  //   useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    console.log("logout");
    localStorage.clear();
    navigate("/login");

    // openConfirm({
    //   title: t("Common.Logout"),
    //   description: t("Common.ConfirmLogoutMessage"),
    //   isOpen: true,
    //   cancelBtnLabel: t("Common.Cancel"),
    //   confirmBtnLabel: t("Common.Delete"),
    //   onCancel: () => closeConfirm(),
    //   onConfirm: () => {
    //     closeConfirm();
    //   },
    // });
  };

  // const changePasswordHandler = (values: any) => {};

  return (
    <>
      <KChatAppBar position="absolute" open={props.open}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={props.toggleDrawer}
            sx={{
              marginRight: 2,
              ...(props.open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            داشبورد مدیریت سامانه پرشیا آزما
          </Typography>
          <Stack direction="row" spacing={1}>
            {/* <IconButton color="inherit">
              <TranslateIcon />
            </IconButton> */}
            {/* <IconButton color="inherit">
              <Brightness4Icon />
            </IconButton> */}
            <IconButton onClick={handleOpenMenu} color="inherit">
              <PersonIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </KChatAppBar>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <MenuItem sx={{ p: "10px 30px 10px 10px" }} onClick={handleCloseMenu}>
          <Box display={"flex"} alignItems={"center"} gap={"10px"}>
            <PersonIcon fontSize="small" />
            <Typography>{t("Common.Profile")}</Typography>
          </Box>
        </MenuItem> */}
        {/* <MenuItem
          sx={{ p: "10px 30px 10px 10px" }}
          onClick={() => {
            handleCloseMenu();
            setIsChangePasswordDialogOpen(true);
          }}
        >
          <Box display={"flex"} alignItems={"center"} gap={"10px"}>
            <LockIcon fontSize="small" />
            <Typography>{t("Common.ChangePassword")}</Typography>
          </Box>
        </MenuItem> */}
        <MenuItem sx={{ p: "10px 30px 10px 10px" }} onClick={logoutHandler}>
          <Box display={"flex"} alignItems={"center"} gap={"10px"}>
            <LogoutIcon fontSize="small" />
            <Typography>خروج</Typography>
          </Box>
        </MenuItem>
      </Menu>
      {/* <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        handleClose={() => setIsChangePasswordDialogOpen(false)}
        handleAction={changePasswordHandler}
      /> */}
    </>
  );
};

export default Header;

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SchoolIcon from "@mui/icons-material/School";
import ScienceIcon from "@mui/icons-material/Science";
import {
  Divider,
  IconButton,
  List,
  Toolbar,
  styled,
  useTheme,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ChatIcon from "@mui/icons-material/Chat";
import FeedIcon from "@mui/icons-material/Feed";
import VerifiedIcon from "@mui/icons-material/Verified";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

import MenuItem from "./menu-item";

const KChatDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    width: 200,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const Sidebar = (props: { open: boolean; toggleDrawer: () => void }) => {
  const theme = useTheme();

  return (
    <KChatDrawer variant="permanent" open={props.open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={props.toggleDrawer}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon sx={{ color: "white" }} />
          ) : (
            <ChevronLeftIcon sx={{ color: "white" }} />
          )}
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ py: 0 }}>
        <MenuItem
          path={"/users"}
          title={"کاربران"}
          icon={<AccountCircleIcon />}
          isMenuOpen={props.open}
        />
        <MenuItem
          path={"/products"}
          title={"تجهیزات"}
          icon={<MedicalServicesIcon />}
          isMenuOpen={props.open}
        />
        <MenuItem
          path={"/courses"}
          title={"دوره ها"}
          icon={<SchoolIcon />}
          isMenuOpen={props.open}
        />
        <MenuItem
          path={"/labs"}
          title={"آزمایشگاه ها"}
          icon={<ScienceIcon />}
          isMenuOpen={props.open}
        />
        <MenuItem
          path={"/feedbacks"}
          title={"نظرات و پیشنهادات"}
          icon={<ChatIcon />}
          isMenuOpen={props.open}
        />
        <MenuItem
          path={"/articles"}
          title={"مقالات"}
          icon={<FeedIcon />}
          isMenuOpen={props.open}
        />
        <MenuItem
          path={"/certificates"}
          title={"تاییدیه ها"}
          icon={<VerifiedIcon />}
          isMenuOpen={props.open}
        />
      </List>
    </KChatDrawer>
  );
};

export default Sidebar;

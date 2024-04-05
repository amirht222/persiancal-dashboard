import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItemProps = {
  isMenuOpen: boolean;
  path: string;
  icon: React.ReactNode;
  title: string;
};

const MenuItem = (props: MenuItemProps) => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          sx={{
            borderLeftWidth: "2px",
            borderLeftStyle: "solid",
            backgroundColor: `${
              pathname === props.path
                ? "#648EEBCC"
                : theme?.palette?.primary?.main
            }`,
            borderLeftColor: `${
              pathname === props.path
                ? theme?.palette?.primary?.light
                : theme?.palette?.primary?.main
            }`,
            minHeight: 48,
            justifyContent: props.isMenuOpen ? "initial" : "center",
            px: 1.5,
            "&:hover": {
              ...(pathname === props.path && { backgroundColor: "#648EEBCC" }),
            },
          }}
          onClick={() => navigate(props.path)}
        >
          {!props.isMenuOpen && (
            <Tooltip title={props.title} arrow={true} placement="left">
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: theme.palette.grey[200],
                  mr: props.isMenuOpen ? 1 : "auto",
                  justifyContent: "center",
                }}
              >
                {props.icon}
              </ListItemIcon>
            </Tooltip>
          )}
          {props.isMenuOpen && (
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: theme.palette.grey[200],
                mr: props.isMenuOpen ? 1 : "auto",
                justifyContent: "center",
              }}
            >
              {props.icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={props.title}
            sx={{
              color: theme.palette.grey[200],
              marginBottom: 0,
              opacity: props.isMenuOpen ? 1 : 0,
            }}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
};

export default MenuItem;

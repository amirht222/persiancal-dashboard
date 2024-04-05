import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import IPaginate from "../../components/UI/pagination";
import AddNewUserDialog from "../../components/users/add-user";
import UsersList from "../../components/users/users-list";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import instance from "../../utils/axiosInstance";
import { objectCleaner } from "../../utils/utils";

type UsersFilters = {
  username: string;
  name: string;
  email: string;
  password: string;
  role: number;
  userStatus: number;
  address: string;
  currentPage: number;
  itemPerPage: number;
};

const UsersPage = () => {
  const theme = useTheme();
  const { openConfirm, closeConfirm } = useConfirm();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<any>({
    username: null,
    name: null,
    email: null,
    password: null,
    role: null,
    userStatus: null,
    address: null,
    currentPage: 1,
    itemPerPage: 3,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (username: string) => {
      return instance.delete(`user/${username}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnack({
        type: "success",
        message: "کاربر با موفقیت حذف شد",
      });
    },
    onError(error) {
      showSnack({
        type: "error",
        message:
          error.message || "حذف کاربر با خطا مواجه شد. لطفا مجددا تلاش کنید",
      });
    },
  });

  const {
    isPending,
    isError,
    data: usersData,
  } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => {
      return instance.get("user/getList", {
        params: objectCleaner({ ...filters }),
      });
    },
  });

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  // const [isFilterUserDialogOpen, setIsFilterUserDialogOpen] = useState(false);

  const deleteUserHandler = (username: string) => {
    openConfirm({
      title: "حذف کاربر",
      description: "آیا از حذف کاربر اطمینان دارید؟",
      isOpen: true,
      cancelBtnLabel: "لغو",
      confirmBtnLabel: "حذف",
      onCancel: () => closeConfirm(),
      onConfirm: async () => {
        closeConfirm();
        deleteMutate(username);
      },
    });
  };

  return (
    <>
      <Box
        sx={{
          px: 5,
          py: 2,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        bgcolor={theme.palette.secondary.light}
        borderRadius={"20px"}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Button
            variant="contained"
            size="large"
            type="button"
            sx={{ minWidth: "auto", color: "white" }}
            onClick={() => {}}
          >
            <FilterListIcon fontSize="medium" />
          </Button>
          {/* <IChips filters={filters} onDeleteChip={handleDeleteChip} /> */}
        </Box>
        <Button
          variant="contained"
          type="button"
          color="success"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setIsAddUserDialogOpen(true)}
          sx={{
            "&:hover": {
              transform: "scale(1.1)",
            },
            transition: "transform 0.2s",
          }}
        >
          افزودن کاربر
        </Button>
      </Box>

      <UsersList
        data={usersData}
        isError={isError}
        isLoading={isPending}
        onDeleteUser={deleteUserHandler}
        // onResetPassword={(id) => setSelectedResetPasswordUser(id)}
      />

      {usersData && usersData.data?.data?.length > 0 && (
        <Stack
          spacing={2}
          justifyContent={"center"}
          flexDirection={"row"}
          mt={3}
        >
          <IPaginate
            count={Math.ceil(usersData.data.count / filters.itemPerPage)}
            onChange={(_event, page: number) =>
              setFilters((prev: any) => ({ ...prev, currentPage: page }))
            }
            page={filters.currentPage}
          />
        </Stack>
      )}
      <AddNewUserDialog
        open={isAddUserDialogOpen}
        handleClose={() => setIsAddUserDialogOpen(false)}
      />
      {/* <FilterUserDialog
        open={isFilterUserDialogOpen}
        handleClose={() => setIsFilterUserDialogOpen(false)}
        filterHandler={(values) =>
          setFilters((prevFilters) => ({ ...prevFilters, ...values }))
        }
      /> */}
      {/* <ResetPasswordDialog
        open={!!selectedResetPasswordUser}
        handleClose={() => setSelectedResetPasswordUser(null)}
        handleAction={resetPasswordHandler}
      /> */}
    </>
  );
};

export default UsersPage;

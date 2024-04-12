import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import IPaginate from "../../components/UI/pagination";
import AddNewLabDialog from "../../components/labs/add";
import FilterLabsDialog from "../../components/labs/filter";
import LabsList from "../../components/labs/list";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import instance from "../../utils/axiosInstance";
import { objectCleaner } from "../../utils/utils";

type LabsFilters = {
  name: string;
  labStatus: number;
  currentPage: number;
  itemPerPage: number;
};

const LabsPage = () => {
  const theme = useTheme();
  const { openConfirm, closeConfirm } = useConfirm();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    name: null,
    labStatus: null,
    currentPage: 1,
    itemPerPage: 3,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id: string) => {
      return instance.delete(`lab/${id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      showSnack({
        type: "success",
        message: "آزمایشگاه با موفقیت حذف شد",
      });
    },
    onError(error) {
      showSnack({
        type: "error",
        message:
          error.message || "حذف آزمایشگاه با خطا مواجه شد. لطفا مجددا تلاش کنید",
      });
    },
  });

  const {
    isPending,
    isError,
    data: labsData,
  } = useQuery({
    queryKey: ["labs", filters],
    queryFn: () => {
      return instance.get("lab/getList", {
        params: objectCleaner({ ...filters }),
      });
    },
  });

  const [isAddLabDialogOpen, setIsAddLabDialogOpen] = useState(false);
  const [isFilterLabDialogOpen, setIsFilterLabDialogOpen] = useState(false);

  const deleteLabHandler = (id: string) => {
    openConfirm({
      title: "حذف آزمایشگاه",
      description: "آیا از حذف آزمایشگاه اطمینان دارید؟",
      isOpen: true,
      cancelBtnLabel: "لغو",
      confirmBtnLabel: "حذف",
      onCancel: () => closeConfirm(),
      onConfirm: async () => {
        closeConfirm();
        deleteMutate(id);
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
            onClick={() => {
              setIsFilterLabDialogOpen(true);
            }}
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
          onClick={() => setIsAddLabDialogOpen(true)}
          sx={{
            "&:hover": {
              transform: "scale(1.1)",
            },
            transition: "transform 0.2s",
          }}
        >
          افزودن آزمایشگاه
        </Button>
      </Box>

      <LabsList
        data={labsData}
        isError={isError}
        isLoading={isPending}
        onDeleteLab={deleteLabHandler}
      />

      {labsData && labsData.data?.data?.length > 0 && (
        <Stack
          spacing={2}
          justifyContent={"center"}
          flexDirection={"row"}
          mt={3}
        >
          <IPaginate
            count={Math.ceil(labsData.data.count / filters.itemPerPage)}
            onChange={(_event, page: number) =>
              setFilters((prev: any) => ({ ...prev, currentPage: page }))
            }
            page={filters.currentPage}
          />
        </Stack>
      )}
      <AddNewLabDialog
        open={isAddLabDialogOpen}
        handleClose={() => setIsAddLabDialogOpen(false)}
      />
      <FilterLabsDialog
        open={isFilterLabDialogOpen}
        handleClose={() => setIsFilterLabDialogOpen(false)}
        filterHandler={(values: any) =>
          setFilters((prevFilters) => ({ ...prevFilters, ...values }))
        }
      />
    </>
  );
};

export default LabsPage;

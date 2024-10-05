import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AddNewConsultationDialog from "../../components/consultations/add";
import ConsultationsList from "../../components/consultations/list";
import IPaginate from "../../components/UI/pagination";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import instance from "../../utils/axiosInstance";
import { objectCleaner } from "../../utils/utils";

const ConsultationsPage = () => {
  const theme = useTheme();
  const { openConfirm, closeConfirm } = useConfirm();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    title: null,
    consultationStatus: null,
    provider: null,
    currentPage: 1,
    itemPerPage: 3,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id: string) => {
      return instance.delete(`consultation/${id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      showSnack({
        type: "success",
        message: "مشاوره با موفقیت حذف شد",
      });
    },
    onError(error) {
      showSnack({
        type: "error",
        message:
          error.message || "حذف مشاوره با خطا مواجه شد. لطفا مجددا تلاش کنید",
      });
    },
  });

  const {
    isPending,
    isError,
    data: consultationsData,
  } = useQuery({
    queryKey: ["consultations", filters],
    queryFn: () => {
      return instance.get("consultation/getList", {
        params: objectCleaner({ ...filters }),
      });
    },
  });

  const [isAddConsultationDialogOpen, setIsAddConsultationDialogOpen] =
    useState(false);
  //   const [isFilterCourseDialogOpen, setIsFilterCourseDialogOpen] =
  //     useState(false);

  const deleteConsultationHandler = (id: string) => {
    openConfirm({
      title: "حذف مشاوره",
      description: "آیا از حذف مشاوره اطمینان دارید؟",
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
          {/* <Button
            variant="contained"
            size="large"
            type="button"
            sx={{ minWidth: "auto", color: "white" }}
            onClick={() => {
              //   setIsFilterCourseDialogOpen(true);
            }}
          >
            <FilterListIcon fontSize="medium" />
          </Button> */}
          {/* <IChips filters={filters} onDeleteChip={handleDeleteChip} /> */}
        </Box>
        <Button
          variant="contained"
          type="button"
          color="success"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setIsAddConsultationDialogOpen(true)}
          sx={{
            "&:hover": {
              transform: "scale(1.1)",
            },
            transition: "transform 0.2s",
          }}
        >
          افزودن مشاوره جدید
        </Button>
      </Box>

      <ConsultationsList
        data={consultationsData}
        isError={isError}
        isLoading={isPending}
        onDeleteConsultation={deleteConsultationHandler}
      />

      {consultationsData && consultationsData.data?.data?.length > 0 && (
        <Stack
          spacing={2}
          justifyContent={"center"}
          flexDirection={"row"}
          mt={3}
        >
          <IPaginate
            count={Math.ceil(
              consultationsData.data.count / filters.itemPerPage
            )}
            onChange={(_event, page: number) =>
              setFilters((prev: any) => ({ ...prev, currentPage: page }))
            }
            page={filters.currentPage}
          />
        </Stack>
      )}
      {isAddConsultationDialogOpen && (
        <AddNewConsultationDialog
          open={isAddConsultationDialogOpen}
          handleClose={() => setIsAddConsultationDialogOpen(false)}
        />
      )}
      {/* <FilterCoursesDialog
        open={isFilterCourseDialogOpen}
        handleClose={() => setIsFilterCourseDialogOpen(false)}
        filterHandler={(values: any) =>
          setFilters((prevFilters) => ({ ...prevFilters, ...values }))
        }
      /> */}
    </>
  );
};

export default ConsultationsPage;

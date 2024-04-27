import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import IPaginate from "../../components/UI/pagination";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import instance from "../../utils/axiosInstance";
import { objectCleaner } from "../../utils/utils";
import AddNewCourseDialog from "../../components/courses/add";
import FilterCoursesDialog from "../../components/courses/filter";
import CoursesList from "../../components/courses/list";

// type CoursesFilters = {
//   username: string;
//   name: string;
//   email: string;
//   password: string;
//   role: number;
//   userStatus: number;
//   address: string;
//   currentPage: number;
//   itemPerPage: number;
// };

const CoursesPage = () => {
  const theme = useTheme();
  const { openConfirm, closeConfirm } = useConfirm();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    title: null,
    courseStatus: null,
    provider: null,
    currentPage: 1,
    itemPerPage: 3,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id: string) => {
      return instance.delete(`course/${id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      showSnack({
        type: "success",
        message: "دوره با موفقیت حذف شد",
      });
    },
    onError(error) {
      showSnack({
        type: "error",
        message:
          error.message || "حذف دوره با خطا مواجه شد. لطفا مجددا تلاش کنید",
      });
    },
  });

  const {
    isPending,
    isError,
    data: coursesData,
  } = useQuery({
    queryKey: ["courses", filters],
    queryFn: () => {
      return instance.get("course/getList", {
        params: objectCleaner({ ...filters }),
      });
    },
  });

  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [isFilterCourseDialogOpen, setIsFilterCourseDialogOpen] =
    useState(false);

  const deleteCourseHandler = (id: string) => {
    openConfirm({
      title: "حذف دوره",
      description: "آیا از حذف دوره اطمینان دارید؟",
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
              setIsFilterCourseDialogOpen(true);
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
          onClick={() => setIsAddCourseDialogOpen(true)}
          sx={{
            "&:hover": {
              transform: "scale(1.1)",
            },
            transition: "transform 0.2s",
          }}
        >
          افزودن دوره
        </Button>
      </Box>

      <CoursesList
        data={coursesData}
        isError={isError}
        isLoading={isPending}
        onDeleteCourse={deleteCourseHandler}
      />

      {coursesData && coursesData.data?.data?.length > 0 && (
        <Stack
          spacing={2}
          justifyContent={"center"}
          flexDirection={"row"}
          mt={3}
        >
          <IPaginate
            count={Math.ceil(coursesData.data.count / filters.itemPerPage)}
            onChange={(_event, page: number) =>
              setFilters((prev: any) => ({ ...prev, currentPage: page }))
            }
            page={filters.currentPage}
          />
        </Stack>
      )}
      <AddNewCourseDialog
        open={isAddCourseDialogOpen}
        handleClose={() => setIsAddCourseDialogOpen(false)}
      />
      <FilterCoursesDialog
        open={isFilterCourseDialogOpen}
        handleClose={() => setIsFilterCourseDialogOpen(false)}
        filterHandler={(values: any) =>
          setFilters((prevFilters) => ({ ...prevFilters, ...values }))
        }
      />
    </>
  );
};

export default CoursesPage;

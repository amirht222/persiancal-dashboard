import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AddActivityDialog from "../../components/activities/add/AddActivityDialog";
import ActivitiesList from "../../components/activities/list";
import IPaginate from "../../components/UI/pagination";
import useSnackbar from "../../hooks/useSnackbar";
import instance from "../../utils/axiosInstance";
import { objectCleaner } from "../../utils/utils";

const ActivitiesPage = () => {
  const theme = useTheme();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    providerTitle: null,
    currentPage: 1,
    itemPerPage: 6,
  });

  const {
    isPending,
    isError,
    data: activitiesData,
  } = useQuery({
    queryKey: ["activities", filters],
    queryFn: () => {
      return instance.get("activity/getList", {
        params: objectCleaner({ ...filters }),
      });
    },
  });

  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  //   const [isFilterCourseDialogOpen, setIsFilterCourseDialogOpen] =
  //     useState(false);

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
          onClick={() => setIsAddActivityDialogOpen(true)}
          sx={{
            "&:hover": {
              transform: "scale(1.1)",
            },
            transition: "transform 0.2s",
          }}
        >
          افزودن فعالیت جدید
        </Button>
      </Box>

      <Box
        sx={{ pt: 2, pb: 5 }}
        // bgcolor={theme.palette.secondary.light}
        borderRadius={"20px"}
      >
        <ActivitiesList
          data={activitiesData}
          isError={isError}
          isLoading={isPending}
        />
      </Box>

      {activitiesData && activitiesData.data?.data?.length > 0 && (
        <Stack
          spacing={2}
          justifyContent={"center"}
          flexDirection={"row"}
          mt={3}
        >
          <IPaginate
            count={Math.ceil(activitiesData.data.count / filters.itemPerPage)}
            onChange={(_event, page: number) =>
              setFilters((prev: any) => ({ ...prev, currentPage: page }))
            }
            page={filters.currentPage}
          />
        </Stack>
      )}
      {isAddActivityDialogOpen && (
        <AddActivityDialog
          open={isAddActivityDialogOpen}
          handleClose={() => setIsAddActivityDialogOpen(false)}
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

export default ActivitiesPage;

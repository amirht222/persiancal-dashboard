import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import IPaginate from "../../components/UI/pagination";
import instance from "../../utils/axiosInstance";
import { objectCleaner } from "../../utils/utils";
import FeedbacksList from "../../components/feedbacks/list";
import FilterFeedbacksDialog from "../../components/feedbacks/filter";

type FeedbacksFilters = {
  senderName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  currentPage: number;
  itemPerPage: number;
};

const FeedbacksPage = () => {
  const theme = useTheme();

  const [filters, setFilters] = useState({
    senderName: null,
    companyName: null,
    email: null,
    phoneNumber: null,
    currentPage: 1,
    itemPerPage: 3,
  });

  const {
    isPending,
    isError,
    data: feedbacksData,
  } = useQuery({
    queryKey: ["feedbacks", filters],
    queryFn: () => {
      return instance.get("feedback/getList", {
        params: objectCleaner({ ...filters }),
      });
    },
  });

  const [isFilterFeedbackDialogOpen, setIsFilterFeedbackDialogOpen] = useState(false);


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
              setIsFilterFeedbackDialogOpen(true);
            }}
          >
            <FilterListIcon fontSize="medium" />
          </Button>
          {/* <IChips filters={filters} onDeleteChip={handleDeleteChip} /> */}
        </Box>
      </Box>

      <FeedbacksList
        data={feedbacksData}
        isError={isError}
        isLoading={isPending}
      />

      {feedbacksData && feedbacksData.data?.data?.length > 0 && (
        <Stack
          spacing={2}
          justifyContent={"center"}
          flexDirection={"row"}
          mt={3}
        >
          <IPaginate
            count={Math.ceil(feedbacksData.data.count / filters.itemPerPage)}
            onChange={(_event, page: number) =>
              setFilters((prev: any) => ({ ...prev, currentPage: page }))
            }
            page={filters.currentPage}
          />
        </Stack>
      )}
 
      <FilterFeedbacksDialog
        open={isFilterFeedbackDialogOpen}
        handleClose={() => setIsFilterFeedbackDialogOpen(false)}
        filterHandler={(values: any) =>
          setFilters((prevFilters) => ({ ...prevFilters, ...values }))
        }
      />
    </>
  );
};

export default FeedbacksPage;

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
import ArticlesList from "../../components/articles/list";
import AddArticleDialog from "../../components/articles/add/AddArticleDialog";

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

const ArticlesPage = () => {
  const theme = useTheme();
  const { openConfirm, closeConfirm } = useConfirm();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    title: null,
    provider: null,
    currentPage: 1,
    itemPerPage: 3,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id: string) => {
      return instance.delete(`article/${id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      showSnack({
        type: "success",
        message: "مقاله با موفقیت حذف شد",
      });
    },
    onError(error) {
      showSnack({
        type: "error",
        message:
          error.message || "حذف مقاله با خطا مواجه شد. لطفا مجددا تلاش کنید",
      });
    },
  });

  const {
    isPending,
    isError,
    data: articlesData,
  } = useQuery({
    queryKey: ["articles", filters],
    queryFn: () => {
      return instance.get("article/getList", {
        params: objectCleaner({ ...filters }),
      });
    },
  });

  const [isAddArticleDialogOpen, setIsAddArticleDialogOpen] = useState(false);
  const [isFilterArticleDialogOpen, setIsFilterArticleDialogOpen] =
    useState(false);

  const deleteArticleHandler = (id: string) => {
    openConfirm({
      title: "حذف مقاله",
      description: "آیا از حذف مقاله اطمینان دارید؟",
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
              setIsFilterArticleDialogOpen(true);
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
          onClick={() => setIsAddArticleDialogOpen(true)}
          sx={{
            "&:hover": {
              transform: "scale(1.1)",
            },
            transition: "transform 0.2s",
          }}
        >
          افزودن مقاله
        </Button>
      </Box>

      <ArticlesList
        data={articlesData}
        isError={isError}
        isLoading={isPending}
        onDeleteArticle={deleteArticleHandler}
      />

      {articlesData && articlesData.data?.data?.length > 0 && (
        <Stack
          spacing={2}
          justifyContent={"center"}
          flexDirection={"row"}
          mt={3}
        >
          <IPaginate
            count={Math.ceil(articlesData.data.count / filters.itemPerPage)}
            onChange={(_event, page: number) =>
              setFilters((prev: any) => ({ ...prev, currentPage: page }))
            }
            page={filters.currentPage}
          />
        </Stack>
      )}
      {isAddArticleDialogOpen && (
        <AddArticleDialog
          open={isAddArticleDialogOpen}
          handleClose={() => setIsAddArticleDialogOpen(false)}
        />
      )}
      {/* <FilterArticlesDialog
        open={isFilterArticleDialogOpen}
        handleClose={() => setIsFilterArticleDialogOpen(false)}
        filterHandler={(values: any) =>
          setFilters((prevFilters) => ({ ...prevFilters, ...values }))
        }
      /> */}
    </>
  );
};

export default ArticlesPage;

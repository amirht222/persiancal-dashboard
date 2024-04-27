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
import ProductList from "../../components/products/list";

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

const ProductsPage = () => {
  const theme = useTheme();
  const { openConfirm, closeConfirm } = useConfirm();
  const { showSnack } = useSnackbar();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    title: null,
    productStatus: null,
    price: null,
    currentPage: 1,
    itemPerPage: 9,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id: string) => {
      return instance.delete(`product/${id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSnack({
        type: "success",
        message: "تجهیز با موفقیت حذف شد",
      });
    },
    onError(error) {
      showSnack({
        type: "error",
        message:
          error.message || "حذف تجهیز با خطا مواجه شد. لطفا مجددا تلاش کنید",
      });
    },
  });

  const {
    isPending,
    isError,
    data: productsData,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => {
      return instance.get("product/getList", {
        params: objectCleaner({ ...filters }),
      });
    },
  });

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isFilterProductDialogOpen, setIsFilterProductDialogOpen] =
    useState(false);

  const deleteProductHandler = (id: string) => {
    openConfirm({
      title: "حذف تجهیز",
      description: "آیا از حذف تجهیز اطمینان دارید؟",
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
              setIsFilterProductDialogOpen(true);
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
          onClick={() => setIsAddProductDialogOpen(true)}
          sx={{
            "&:hover": {
              transform: "scale(1.1)",
            },
            transition: "transform 0.2s",
          }}
        >
          افزودن تجهیز
        </Button>
      </Box>

      <Box
        sx={{ px: 5, pt: 10, pb: 5 }}
        // bgcolor={theme.palette.secondary.light}
        borderRadius={"20px"}
      >
        <ProductList
          data={productsData}
          isError={isError}
          isLoading={isPending}
        />
      </Box>

      {productsData && productsData.data?.data?.length > 0 && (
        <Stack
          spacing={2}
          justifyContent={"center"}
          flexDirection={"row"}
          mt={3}
        >
          <IPaginate
            count={Math.ceil(productsData.data.count / filters.itemPerPage)}
            onChange={(_event, page: number) =>
              setFilters((prev: any) => ({ ...prev, currentPage: page }))
            }
            page={filters.currentPage}
          />
        </Stack>
      )}
      {/* <AddNewProductDialog
        open={isAddProductDialogOpen}
        handleClose={() => setIsAddProductDialogOpen(false)}
      />
      <FilterProductsDialog
        open={isFilterProductDialogOpen}
        handleClose={() => setIsFilterProductDialogOpen(false)}
        filterHandler={(values: any) =>
          setFilters((prevFilters) => ({ ...prevFilters, ...values }))
        }
      /> */}
    </>
  );
};

export default ProductsPage;

import { Pagination, PaginationItem } from "@mui/material";
import { convertEnglishToPersianDigits } from "../../../utils/utils";

type IPaginateProps = {
  onChange: (event: React.BaseSyntheticEvent, page: number) => void;
  page: number;
  count: number | undefined;
};

export default function IPaginate(props: IPaginateProps) {
  return (
    <>
      <Pagination
        color="primary"
        shape="rounded"
        variant="outlined"
        {...props}
        renderItem={(params) => {
          params = {
            ...params,
            page:
              typeof params.page === "number"
                ? convertEnglishToPersianDigits(params.page)
                : params.page,
          };
          return <PaginationItem {...params} />;
        }}
        {...props}
      />
    </>
  );
}

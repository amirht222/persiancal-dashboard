import DeleteIcon from "@mui/icons-material/Delete";
import { mapArticleStatus, providerMapper } from "../../../utils/utils";
import ITable from "../../UI/table";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  onDeleteArticle: (articleId: string) => void;
}

const ArticlesList = (props: Props) => {
  const transformTableData = (response: any) => {
    if (!response) return;
    return response.map((res: any) => ({
      id: res.id,
      title: res.title,
      provider: providerMapper(res.provider),
      text: res.text.length > 20 ? res.text.substring(0, 20) + "..." : res.text,
      articleStatus: mapArticleStatus(res.articleStatus),
    }));
  };

  return (
    <>
      <ITable
        emptyTableMessage={"مقاله ای یافت نشد"}
        tableColumns={[
          { field: "id", title: "شناسه" },
          { field: "title", title: "عنوان" },
          { field: "text", title: "متن مقاله" },
          { field: "articleStatus", title: "وضعیت" },
          { field: "provider", title: "شرکت" },
        ]}
        tableData={transformTableData(props.data?.data?.data)}
        isLoading={props.isLoading}
        isError={props.isError}
        tableLabel="articles"
        actions={[
          {
            icon: <DeleteIcon fontSize="small" />,
            handler: props.onDeleteArticle,
          },
        ]}
      />
    </>
  );
};

export default ArticlesList;

import DeleteIcon from "@mui/icons-material/Delete";
import { providerMapper } from "../../../utils/utils";
import ITable from "../../UI/table";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  onDeleteCertification: (certId: string) => void;
}

const CertificationsList = (props: Props) => {
  const transformTableData = (response: any) => {
    if (!response) return;
    return response.map((res: any) => ({
      id: res.id,
      title: res.title,
      provider: providerMapper(res.provider),
      description:
        res.description.length > 20
          ? res.description.substring(0, 20) + "..."
          : res.description,
    }));
  };

  return (
    <>
      <ITable
        emptyTableMessage={"تاییدیه ای یافت نشد"}
        tableColumns={[
          { field: "id", title: "شناسه" },
          { field: "title", title: "عنوان" },
          { field: "description", title: "متن تاییدیه" },
          { field: "provider", title: "شرکت" },
        ]}
        tableData={transformTableData(props.data?.data?.data)}
        isLoading={props.isLoading}
        isError={props.isError}
        tableLabel="certificates"
        actions={[
          {
            icon: <DeleteIcon fontSize="small" />,
            handler: props.onDeleteCertification,
          },
        ]}
      />
    </>
  );
};

export default CertificationsList;

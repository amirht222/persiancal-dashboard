import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { mapLabStatus } from "../../../utils/utils";
import ITable from "../../UI/table";
import EditLabDialog from "../edit";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  onDeleteLab: (id: string) => void;
}

const LabsList = (props: Props) => {
  const [isEditLabDialogOpen, setIsEditLabDialogOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<null | object>(null);

  const transformTableData = (response: any) => {
    if (!response) return;
    return response.map((res: any) => ({
      id: res.id,
      name: res.name,
      description: res.description,
      labStatus: mapLabStatus(res.labStatus),
    }));
  };

  const editLabHandler = (id: string) => {
    const foundLab = props.data?.data?.data?.find((lab: any) => lab.id === id);
    setSelectedLab(foundLab);
    setIsEditLabDialogOpen(true);
  };

  return (
    <>
      <ITable
        emptyTableMessage={"آزمایشگاه یافت نشد"}
        tableColumns={[
          { field: "name", title: "نام آزمایشگاه" },
          { field: "description", title: "متن توضیحات" },
          { field: "labStatus", title: "وضعیت" },
        ]}
        tableData={transformTableData(props.data?.data?.data)}
        isLoading={props.isLoading}
        isError={props.isError}
        tableLabel="labs"
        actions={[
          {
            icon: <EditIcon fontSize="small" />,
            handler: editLabHandler,
          },
          {
            icon: <DeleteIcon fontSize="small" />,
            handler: props.onDeleteLab,
          },
        ]}
      />
      {isEditLabDialogOpen && (
        <EditLabDialog
          data={selectedLab}
          open={isEditLabDialogOpen}
          handleClose={() => {
            setIsEditLabDialogOpen(false);
            setSelectedLab(null);
          }}
        />
      )}
    </>
  );
};

export default LabsList;

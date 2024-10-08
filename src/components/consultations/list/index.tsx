import DeleteIcon from "@mui/icons-material/Delete";
import ITable from "../../UI/table";
import { mapConsultationStatus } from "../../../utils/utils";
import { Dialog, DialogContent, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState } from "react";
const base_url = import.meta.env.VITE_BASE_URL;

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  onDeleteConsultation: (consultationId: string) => void;
}

const ConsultationsList = (props: Props) => {
  const [selectedConsultation, setSelectedConsultation] = useState<
    null | object
  >(null);
  const [showDescription, setShowDescription] = useState(false);

  const transformTableData = (response: any) => {
    if (!response) return;
    return response.map((res: any) => ({
      id: res.id,
      imagePath: res.imagePath ? (
        <img
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
          src={`${base_url}/${res.imagePath}`}
        />
      ) : (
        "---"
      ),
      title: res.title,
      provider: res.provider,
      // description:
      //   res.description.length > 20
      //     ? res.description.substring(0, 20) + "..."
      //     : res.description,
      consultationStatus: mapConsultationStatus(res.consultationStatus),
    }));
  };

  return (
    <>
      <ITable
        emptyTableMessage={"مشاوره ای یافت نشد"}
        tableColumns={[
          { field: "imagePath", title: "عکس" },
          { field: "title", title: "نام مشاوره" },
          { field: "provider", title: "نام شرکت" },
          { field: "consultationStatus", title: "وضعیت مشاوره" },
          // { field: "description", title: "توضیحات" },
        ]}
        tableData={transformTableData(props.data?.data?.data)}
        isLoading={props.isLoading}
        isError={props.isError}
        tableLabel="courses"
        actions={[
          {
            icon: (
              <Tooltip title="مشاهده توضیحات">
                <DescriptionIcon fontSize="small" />
              </Tooltip>
            ),
            handler: (id: string) => {
              const foundConsultation = props.data?.data?.data?.find(
                (consultation: any) => consultation.id === id
              );
              setSelectedConsultation(foundConsultation);
              setShowDescription(true);
            },
          },
          {
            icon: <DeleteIcon fontSize="small" />,
            handler: props.onDeleteConsultation,
          },
        ]}
      />
      {showDescription && (
        <Dialog
          open={showDescription}
          onClose={() => {
            setShowDescription(false);
          }}
        >
          <DialogContent sx={{ minWidth: 500 }}>
            <div
              dangerouslySetInnerHTML={{
                __html: (selectedConsultation as any)?.description,
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ConsultationsList;

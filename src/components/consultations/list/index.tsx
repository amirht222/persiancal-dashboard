import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import ITable from "../../UI/table";
// import EditCourseDialog from "../edit";
import { mapConsultationStatus } from "../../../utils/utils";
const base_url = import.meta.env.VITE_BASE_URL;

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  onDeleteConsultation: (consultationId: string) => void;
}

const ConsultationsList = (props: Props) => {
  // const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  // const [selectedCourse, setSelectedCourse] = useState<null | object>(null);

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
      description:
        res.description.length > 20
          ? res.description.substring(0, 20) + "..."
          : res.description,
      consultationStatus: mapConsultationStatus(res.consultationStatus),
    }));
  };

  // const editCourseHandler = (id: string) => {
  //   const foundCourse = props.data?.data?.data?.find(
  //     (course: any) => course.id === id
  //   );
  //   setSelectedCourse(foundCourse);
  //   setIsEditCourseDialogOpen(true);
  // };

  return (
    <>
      <ITable
        emptyTableMessage={"مشاوره ای یافت نشد"}
        tableColumns={[
          { field: "imagePath", title: "عکس" },
          { field: "title", title: "نام مشاوره" },
          { field: "provider", title: "نام شرکت" },
          { field: "consultationStatus", title: "وضعیت مشاوره" },
          { field: "description", title: "توضیحات" },
        ]}
        tableData={transformTableData(props.data?.data?.data)}
        isLoading={props.isLoading}
        isError={props.isError}
        tableLabel="courses"
        actions={[
          // {
          //   icon: <EditIcon fontSize="small" />,
          //   handler: editCourseHandler,
          // },
          {
            icon: <DeleteIcon fontSize="small" />,
            handler: props.onDeleteConsultation,
          },
        ]}
      />
      {/* {isEditCourseDialogOpen && (
        <EditCourseDialog
          data={selectedCourse}
          open={isEditCourseDialogOpen}
          handleClose={() => {
            setIsEditCourseDialogOpen(false);
            setSelectedCourse(null);
          }}
        />
      )} */}
    </>
  );
};

export default ConsultationsList;

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import ITable from "../../UI/table";
import EditCourseDialog from "../edit";
import { mapCourseStatus } from "../../../utils/utils";
import { Dialog, DialogContent, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  onDeleteCourse: (courseId: string) => void;
}

const CoursesList = (props: Props) => {
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<null | object>(null);
  const [showDescription, setShowDescription] = useState(false);

  const transformTableData = (response: any) => {
    if (!response) return;
    return response.map((res: any) => ({
      id: res.id,
      title: res.title,
      provider: res.provider,
      duration: res.duration + " ساعت" || 0,
      // description: res.description,
      courseStatus: mapCourseStatus(res.courseStatus),
    }));
  };

  const editCourseHandler = (id: string) => {
    const foundCourse = props.data?.data?.data?.find(
      (course: any) => course.id === id
    );
    setSelectedCourse(foundCourse);
    setIsEditCourseDialogOpen(true);
  };

  return (
    <>
      <ITable
        emptyTableMessage={"دوره ای یافت نشد"}
        tableColumns={[
          { field: "title", title: "نام دوره" },
          { field: "provider", title: "نام شرکت" },
          { field: "courseStatus", title: "وضعیت دوره" },
          { field: "duration", title: "مدت زمان" },
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
              const foundCourse = props.data?.data?.data?.find(
                (course: any) => course.id === id
              );
              setSelectedCourse(foundCourse);
              setShowDescription(true);
            },
          },
          {
            icon: <EditIcon fontSize="small" />,
            handler: editCourseHandler,
          },
          {
            icon: <DeleteIcon fontSize="small" />,
            handler: props.onDeleteCourse,
          },
        ]}
      />
      {isEditCourseDialogOpen && (
        <EditCourseDialog
          data={selectedCourse}
          open={isEditCourseDialogOpen}
          handleClose={() => {
            setIsEditCourseDialogOpen(false);
            setSelectedCourse(null);
          }}
        />
      )}

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
                __html: (selectedCourse as any)?.description,
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CoursesList;

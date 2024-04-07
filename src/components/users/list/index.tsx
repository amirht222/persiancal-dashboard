import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { mapUserRole, mapUserStatus } from "../../../utils/utils";
import ITable from "../../UI/table";
import EditUserDialog from "../edit";
import { useState } from "react";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  onDeleteUser: (userId: string) => void;
}

const UsersList = (props: Props) => {
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<null | object>(null);

  const transformTableData = (response: any) => {
    if (!response) return;
    return response.map((res: any) => ({
      id: res.username,
      username: res.username,
      email: res.email,
      userStatus: mapUserStatus(res.userStatus),
      role: mapUserRole(res.role),
      name: res.name,
      address: res.address,
    }));
  };

  const editUserHandler = (username: string) => {
    const foundUser = props.data?.data?.data?.find(
      (user: any) => user.username === username
    );
    setSelectedUser(foundUser);
    setIsEditUserDialogOpen(true);
  };

  return (
    <>
      <ITable
        emptyTableMessage={"کاربری یافت نشد"}
        tableColumns={[
          { field: "name", title: "نام" },
          { field: "username", title: "نام کاربری" },
          { field: "email", title: "ایمیل" },
          { field: "userStatus", title: "وضعیت" },
          { field: "role", title: "نقش" },
          { field: "address", title: "آدرس" },
        ]}
        tableData={transformTableData(props.data?.data?.data)}
        isLoading={props.isLoading}
        isError={props.isError}
        tableLabel="users"
        actions={[
          {
            icon: <EditIcon fontSize="small" />,
            handler: editUserHandler,
          },
          {
            icon: <DeleteIcon fontSize="small" />,
            handler: props.onDeleteUser,
          },
        ]}
      />
      {isEditUserDialogOpen && (
        <EditUserDialog
          data={selectedUser}
          open={isEditUserDialogOpen}
          handleClose={() => {
            setIsEditUserDialogOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
};

export default UsersList;

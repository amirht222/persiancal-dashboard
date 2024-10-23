import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogContent, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import ITable from "../../UI/table";
import EditProviderDialog from "../edit";
import { providerMapper } from "../../../utils/utils";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
}

const ProvidersList = (props: Props) => {
  const [isEditProviderDialogOpen, setIsEditProviderDialogOpen] =
    useState(false);
  const [selectedProvider, setSelectedProvider] = useState<null | object>(null);
  const [showAboutUs, setShowAboutUs] = useState(false);

  const transformTableData = (response: any) => {
    if (!response) return;
    return response.map((res: any) => ({
      id: res.providerTitle,
      providerTitle: providerMapper(res.providerTitle),
      email: res.email,
      address: res.address,
      telephone: res.telephone,
      fax: res.fax,
    }));
  };

  const editProviderHandler = (providerTitle: string) => {
    const foundProvider = props.data?.data?.data?.find(
      (providerObj: any) => providerObj.providerTitle === providerTitle
    );
    setSelectedProvider(foundProvider);
    setIsEditProviderDialogOpen(true);
  };

  return (
    <>
      <ITable
        emptyTableMessage={"اطلاعاتی یافت نشد"}
        tableColumns={[
          { field: "providerTitle", title: "نام شرکت" },
          { field: "email", title: "ایمیل" },
          { field: "telephone", title: "شماره تلفن" },
          { field: "fax", title: "فکس" },
          { field: "address", title: "آدرس" },
        ]}
        tableData={transformTableData(props.data?.data?.data)}
        isLoading={props.isLoading}
        isError={props.isError}
        tableLabel="providers"
        actions={[
          {
            icon: (
              <Tooltip title="درباره شرکت">
                <DescriptionIcon fontSize="small" />
              </Tooltip>
            ),
            handler: (providerTitle: string) => {
              const foundProvider = props.data?.data?.data?.find(
                (providerObj: any) =>
                  providerObj.providerTitle === providerTitle
              );
              setSelectedProvider(foundProvider);
              setShowAboutUs(true);
            },
          },
          {
            icon: (
              <Tooltip title="ویرایش">
                <EditIcon fontSize="small" />
              </Tooltip>
            ),
            handler: editProviderHandler,
          },
        ]}
      />
      {isEditProviderDialogOpen && (
        <EditProviderDialog
          data={selectedProvider}
          open={isEditProviderDialogOpen}
          handleClose={() => {
            setIsEditProviderDialogOpen(false);
            setSelectedProvider(null);
          }}
        />
      )}
      {showAboutUs && (
        <Dialog
          open={showAboutUs}
          onClose={() => {
            setShowAboutUs(false);
          }}
        >
          <DialogContent>
            <div
              dangerouslySetInnerHTML={{
                __html: (selectedProvider as any)?.aboutUs,
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProvidersList;

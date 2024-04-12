import ITable from "../../UI/table";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
}

const FeedbacksList = (props: Props) => {
 

  return (
    <ITable
      emptyTableMessage={"نظر یا پیشنهادی یافت نشد"}
      tableColumns={[
        { field: "senderName", title: "نام فرستنده" },
        { field: "companyName", title: "نام سازمان" },
        { field: "email", title: "ایمیل" },
        { field: "phoneNumber", title: "شماره موبایل" },
        { field: "text", title: "متن نظر" },
      ]}
      tableData={props.data?.data?.data}
      isLoading={props.isLoading}
      isError={props.isError}
      tableLabel="feedbacks"
    //   actions={[]}
    />
  );
};

export default FeedbacksList;

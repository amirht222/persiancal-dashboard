import { useQuery } from "@tanstack/react-query";
import instance from "../../utils/axiosInstance";
import ProvidersList from "../../components/providers/list";

const ProvidersPage = () => {
  const {
    isPending,
    isError,
    data: providersData,
  } = useQuery({
    queryKey: ["providers"],
    queryFn: () => {
      return instance.get("provider/getList");
    },
  });

  return (
    <ProvidersList
      data={providersData}
      isError={isError}
      isLoading={isPending}
    />
  );
};

export default ProvidersPage;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTopologyById } from "@/services/topology";
import { showInfoToast } from "@/utils/toasts";
import { UpdateTopologyParams } from "@/types/Services";

const useUpdateTopology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateTopologyParams) =>
      updateTopologyById(params),

    onSuccess: (data) => {

      // refetch topology
      queryClient.invalidateQueries({ queryKey: ["topology", data.id] });

      showInfoToast({
        title: "Cambios guardados",
        description: "La topología ha sido actualizada correctamente.",
      })
    },
  });
};

export default useUpdateTopology;

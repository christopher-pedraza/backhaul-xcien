import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTopology } from "@/services/topology";
import { showSuccessToast } from "@/utils/toasts";
import { CreateTopologyParams } from "@/types/Services";

const useCreateTopology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateTopologyParams) => createTopology(params),
    onSuccess: () => {
      // refresh the list of topologies
      queryClient.invalidateQueries({ queryKey: ["topologies"] });

      showSuccessToast({
        title: "Topología creada con éxito",
        description:
          "La nueva topología ha sido creada y está lista para ser configurada.",
      });
    },
  });
};

export default useCreateTopology;

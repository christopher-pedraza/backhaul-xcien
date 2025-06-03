import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTopologyById } from "@/services/topology";
import { showSuccessToast } from "@/utils/toasts";

const useDeleteTopology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTopologyById(id),
    onSuccess: () => {
      // refresh the list of topologies
      queryClient.invalidateQueries({ queryKey: ["topologies"] });

      showSuccessToast({
        title: "Topología eliminada con éxito",
        description: "La topología ha sido eliminada correctamente.",
      });
    },
  });
};

export default useDeleteTopology;

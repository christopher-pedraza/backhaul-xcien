import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTopologyById } from "@/services/topology";

const useDeleteTopology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTopologyById(id),
    onSuccess: () => {
      
      // refresh the list of topologies
      queryClient.invalidateQueries({ queryKey: ["topologies"] });
    },
  });
};

export default useDeleteTopology;

import { getTopologyById } from '@/services/topology';
import { useQuery } from '@tanstack/react-query';

const useTopology = (
  id: string
) => {

  return useQuery({
    queryKey: ['topology', id],
    queryFn: () => getTopologyById(id),
    enabled: !!id,
  });
};

export default useTopology;

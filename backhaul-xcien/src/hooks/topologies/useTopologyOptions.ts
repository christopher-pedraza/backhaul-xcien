import { SelectOption } from '@/components/Selector/types';
import { getTopologyOptions } from '@/services/topology';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';


const useTopologyOptions = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['topologies'],
    queryFn: getTopologyOptions,
  });


  // transform data to the format required by the selector
  const topologyOptions: SelectOption[] = useMemo(() => {
    if (!data) return [];

    return data.map(({ id, name }) => ({ key: id, label: name }));
  }, [data]);

  return { isLoading, topologyOptions };
};

export default useTopologyOptions;

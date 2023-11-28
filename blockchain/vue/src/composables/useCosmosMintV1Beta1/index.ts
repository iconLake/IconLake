/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions } from "@tanstack/vue-query";
import { useClient } from '../useClient';
import type { Ref } from 'vue'

export default function useCosmosMintV1Beta1() {
  const client = useClient();
  const QueryParams = ( options: any) => {
    const key = { type: 'QueryParams',  };    
    return useQuery([key], () => {
      return  client.CosmosMintV1Beta1.query.queryParams().then( res => res.data );
    }, options);
  }
  
  const QueryInflation = ( options: any) => {
    const key = { type: 'QueryInflation',  };    
    return useQuery([key], () => {
      return  client.CosmosMintV1Beta1.query.queryInflation().then( res => res.data );
    }, options);
  }
  
  const QueryAnnualProvisions = ( options: any) => {
    const key = { type: 'QueryAnnualProvisions',  };    
    return useQuery([key], () => {
      return  client.CosmosMintV1Beta1.query.queryAnnualProvisions().then( res => res.data );
    }, options);
  }
  
  return {QueryParams,QueryInflation,QueryAnnualProvisions,
  }
}
import apiClient from './apiClient';
import { API_PATHS } from './config';
import { ChainConfigReturn } from '../model/types';
import { utils } from 'ethers';

export const getGatewayURL = (url: string): string => {
  return url.replace(
    'https://gateway.pinata.cloud/ipfs/',
    'https://medici-test.mypinata.cloud/ipfs/'
  );
};

export const getMetadata = async (metadataurl: string) => {
  // console.log("getting metadata for " + metadataurl)
  return apiClient.get(getGatewayURL(metadataurl)).then((response) => {
    return response.data;
  });
};

export const getChainConfig = async (
  chain: string
): Promise<ChainConfigReturn> => {
  // console.log("Getting config for chain " + chain)
  const request_data = {
    chainid: chain,
  };
  return apiClient
    .get(API_PATHS.RETRIEVE_CHAIN_CONFIG, { params: request_data })
    .then(function (response) {
      // console.log(response.data)
      return Promise.resolve(response.data);
    })
    .catch(function (error) {
      // console.log(error)
      console.log(error);
      return Promise.reject('Error getting chain config');
    });
};

export const getNameAvailability = async (
  name: string,
  connectedChain: string
) => {
  if (name === '') {
    return Promise.resolve(false);
  }
  const request_data = {
    collection: name,
    chainid: parseInt(connectedChain, 16),
  };

  return apiClient
    .get(API_PATHS.CHECK_NAME, { params: request_data })
    .then(function (response) {
      // console.log(response.data)
      if (response.data.value === true) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    })
    .catch(function (error) {
      // console.log(error);
      return Promise.reject('Error checking name availability');
    });
};


export const getResourceType = async (contract: string) => {
  // console.log("Getting contract cover for " + contract);
  const request_data = {
    collection: contract
  };

  return apiClient
    .get(API_PATHS.RETRIEVE_PROJECT_RESOURCE_TYPE, { params: request_data })
    .then(function (response) {
      return Promise.resolve({
        success: true,
        type: response.data,
      });
    })
    .catch(function (error) {
      return Promise.reject({
        success: false,
        type: 'Error getting contract resource type',
      });
    });
};

export const getContractCover = async (contract: string) => {
  // console.log("Getting contract cover for " + contract);
  const request_data = {
    collection: contract,
  };
  return apiClient
  .get(API_PATHS.CLAIM_COVER, { params: request_data })
  .then(function (res) {
    return Promise.resolve(res.data.cover_cdn_url);
  })
  .catch(function (error) {
    return Promise.reject("Error getting cover thumbnail")
  });
};

export const getClaim = async (contract: string) => {
  const request_data = {
    collection: contract,
  };
  return apiClient
    .get(API_PATHS.CLAIM_FETCH, { params: request_data })
    .then(function (res) {
      return Promise.resolve(res.data);
    })
    .catch(function (error) {
      return Promise.reject("Error fetching claim")
    });
};

export const getContractCoverThumbnail = async (contract: string) => {
  // console.log("Getting contract cover for " + contract);
  const request_data = {
    collection: contract,
  };
  return apiClient
    .get(API_PATHS.CLAIM_COVER, { params: request_data })
    .then(function (res) {
      return Promise.resolve(res.data.cover_cdn_thumbnail_url);
    })
    .catch(function (error) {
      return Promise.reject("Error getting cover thumbnail")
    });
};

export const getContractAudioSamples = async (contract: string) => {
  const request_data = {
    collection: contract,
  };
  const res = await apiClient
    .get(API_PATHS.CLAIM_AUDIOSAMPLES, { params: request_data })
    .then(function (res) {
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(res.statusText);
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  if (res) {
    return Promise.resolve(res);
  } else {
    return Promise.reject('error');
  }
};

export const getContractClaimStatus = async (
  contractName: string,
  chainid: string
): Promise<any> => {
  const request_data = {
    collection: contractName,
    chainid: chainid,
  };

  return apiClient
    .get(API_PATHS.RETRIEVE_CONTRACT_STATUS, { params: request_data })
    .then(function (response) {
      return Promise.resolve({
        success: true,
        status: response.data.contractStatus,
      });
    })
    .catch(function (error) {
      return Promise.reject({
        success: false,
        status: 'error getting contract status',
      });
    });
};

export const getAllContracts = async (
  masterAddress: string,
  chainid: number
): Promise<any> => {
  const request_data = {
    masterAddress: utils.getAddress(masterAddress),
    chainID: chainid,
  };
  return apiClient
    .post(API_PATHS.GET_ALL_LAUNCHED_CONTRACTS, request_data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(function (response) {
      // console.log(response)
      return Promise.resolve({
        status: 'success',
        contracts: response.data.launchedContracts,
      });
    })
    .catch(function (error) {
      // console.log(error)
      return Promise.reject({
        status: 'failure',
        contracts: null,
      });
    });
};

export const getAllImageCollections = async() => {
  return apiClient
  .get(API_PATHS.RETRIEVE_ART_COLLECTIONS_BASIC)
  .then(function(response) {
    return Promise.resolve(response.data)
  })
  .catch(function(error) {
    return Promise.reject(error.message)
  })
}

export const getAllMusicCollections = async() => {
  return apiClient
  .get(API_PATHS.RETRIEVE_MUSIC_COLLECTIONS_BASIC)
  .then(function(response) {
    return Promise.resolve(response.data)
  })
  .catch(function(error) {
    return Promise.reject(error.message)
  })
}

export const getCuratedCollection = async() => {
  const request_data = {
    maxNumber: 3
  }

  return apiClient
  .get(API_PATHS.RETRIEVE_CURATED_COLLECTIONS, { params: request_data })
  .then(function(response) {
    return Promise.resolve(response.data)
  })
  .catch(function(error) {
    return Promise.reject(error.message)
  })
}

export const getAllProjectsByAddress = async(walletAddress: string) => {
  const request_data = {
    "walletAddress": walletAddress
  }

  return apiClient
  .get(API_PATHS.GET_ALL_CREATED_PROJECTS_BY_ADDRESS, { params: request_data })
  .then(function(response) {
    console.log(response)
    return Promise.resolve(response.data)
  })
  .catch(function(error) {
    return Promise.reject(error.message)
  })
}

export const getContractInfoByName = async(contractName: string) => {
  const request_data = {
    "collection": contractName
  }

  return apiClient
  .get(API_PATHS.GET_CONTRACT_BY_NAME, { params: request_data })
  .then(function(response) {
    return Promise.resolve(response.data)
  })
  .catch(function(error) {
    return Promise.reject(error.message)
  })
}
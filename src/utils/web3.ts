import { BigNumber, ethers, utils } from 'ethers'
import { ContractCreationProps, Contract } from '../model/types'

import { API_PATHS, CONFIG } from './config'
import apiClient from './apiClient'
import { getChainConfig } from './retrieve';
const localenv = CONFIG.DEV;

/* -------------------------------------------------------------------------- */
/*                             Merkle Root Methods                            */
/* -------------------------------------------------------------------------- */

export const getMerkleRoot = async (whitelistAddresses: string[]):Promise<string> => {
  const request_data = {
      "whitelistedAddresses" : whitelistAddresses,
  }

  return apiClient.post(
      API_PATHS.GET_MERKLE_ROOT, request_data, 
      {
          headers: {"Content-Type": "application/json"}
      }
  ).then(function(response) {
      console.log(response.data)
      return Promise.resolve(response.data)
  }).catch(function(error) {
      console.log(error)
      return Promise.reject("Error getting merkle root")
  });
}

export const verifyMerkleProof = async (contractAddress: string, callerWallet: any) => {
  const request_data = {
    "ERC721Contract": contractAddress,
    "chainid": callerWallet.chains[0].id,
    "address" : callerWallet.accounts[0].address,
  }

  return apiClient.post(
    API_PATHS.GET_MERKLE_PROOF, request_data, 
    {
        headers: {"Content-Type": "application/json"}
    }
  ).then(function(response) {
    if (response.data.message === "Could not verify address with given Merkle Tree") {
      return Promise.reject({
        success: false,
        merkleProof: null
      })
    } else {
      console.log(response.data);
      return Promise.resolve({
        success: true,
        merkleProof: response.data
      })
    }
    }).catch(function(error) {
        console.log(error)
        return Promise.reject({
          success: false,
          merkleProof: null
    })
  });
}

/* -------------------------------------------------------------------------- */
/*                          Contract Factory Methods                          */
/* -------------------------------------------------------------------------- */

const getFactoryContract = async (callerWallet: any): Promise<ethers.Contract> => {
  const chainConfig = await getChainConfig(callerWallet.chains[0].id)
  const provider = new ethers.providers.Web3Provider(callerWallet.provider)
  const signer = provider.getSigner(callerWallet.accounts[0].address);

  const FactoryContract = new ethers.Contract(chainConfig.factory, localenv.contract.factory_abi, signer);
  return FactoryContract;
}

/* generate a new smart contract from user input */
export const generateNewContract = (callerWallet: any, merkleRoot: string, props: ContractCreationProps): any => {
  return new Promise( async (resolve, reject ) => {
    const FactoryContract = await getFactoryContract(callerWallet);
    console.log(FactoryContract);
      /* From Factory Contract:
     function createContract(
        string memory _name,
        string memory _symbol,
        string memory _baseuri,
        bytes32 _merkleroot,
        uint256 _maxSupply,
        uint256 _price,
        uint256 _maxMintPerPerson,
        address _masterAddress,
        uint256 _claimsStartBlock,
        uint256 _mintStartBlock
      ) 
      */
      try {
        const result_contract = await FactoryContract.createContract(
        props.name, // name
        props.symbol, // symbol
        props.baseuri, // base URI
        merkleRoot, // merkle root
        props.maxSupply, // max supply
        utils.parseUnits(props.price, 'wei'), // price
        props.maxMintsPerPerson, // max mint per person
        props.masterAddress, // master address
        props.claimStartBlock, // claim start block
        props.mintStartBlock, // mint start block
        );
        console.log(result_contract);
        await result_contract.wait(5);
        return resolve("Contract generation success");
      } catch (error) {
        console.log(error)
        return reject("Error creating contract")
      }
  })
}

/* call when new contract is created to update backend */
export const whitelist = async (contractAddress: string, chainId: string, whitelistedAddreses: string[], merkleRoot: string) => {
  const request_data = {
    "contract": contractAddress,
    "chainid": chainId,
    "whitelistedAddresses": whitelistedAddreses,
    "merkleRoot": merkleRoot
  }
  return apiClient.post(
      localenv.api.paths.whitelist, request_data,
      {
          headers: {"Content-Type": "application/json"}
      }
  ).then(function(response) {
      console.log(response.data)
      return Promise.resolve(response.data)
  }).catch(function(error) {
      console.log(error)
      return Promise.reject("Error doing whitelisting")
  });
}

/* call to verify backend results */
export const getNewLaunchedContract = async (masterAddress: string): Promise<Contract> => {
  const request_data = {
      "masterAddress": masterAddress,
  }
  return apiClient.post(
      localenv.api.paths.getNewLaunchedContract, request_data,
      {
          headers: {"Content-Type": "application/json"}
      }
  ).then(function(response) {
      console.log(response.data)
      return Promise.resolve(response.data)
  }).catch(function(error) {
      console.log(error)
      return Promise.reject("Error fetching contract")
  });
}

/* -------------------------------------------------------------------------- */
/*                           Claims Contract Methods                          */
/* -------------------------------------------------------------------------- */

const getClaimsContract = async (callerWallet: any): Promise<ethers.Contract> => {
  const chainConfig = await getChainConfig(callerWallet.chains[0].id)
  const provider = new ethers.providers.Web3Provider(callerWallet.provider)
  const signer = provider.getSigner(callerWallet.accounts[0].address);

  const ClaimsContract = new ethers.Contract(chainConfig.claims, localenv.contract.claim_abi, signer);
  return ClaimsContract;
}

export const claimsInit = async (callerWallet: any, contractAddress: string, tier: string): Promise<boolean>=> {
  if (tier === "free") {
      return Promise.resolve(true);
  } else {
      const claimsContract = await getClaimsContract(callerWallet);
      const pricing = await claimsContract.getPricing(tier);
    try {
      /* function depositForClaimsPage(string memory tier, address contractAddress) */
      const result_contract = await claimsContract.depositForClaimsPage(tier, contractAddress, {value: pricing})
      await result_contract.wait(5);
      return Promise.resolve(true);
    } catch {
      return Promise.resolve(false);
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Validators                                 */
/* -------------------------------------------------------------------------- */

export const isValidAddress = (address: string) => {
  return utils.getAddress(address);
}

export const readyToTransact = async (callerWallet: any, connect: any, setChain: any): Promise<boolean> => {
  if (!callerWallet) {
      await connect({});
  }
  return setChain({ chainId: localenv.network.id })
}

/* -------------------------------------------------------------------------- */
/*                    Contract Instance Interaction Methods                   */
/* -------------------------------------------------------------------------- */

export const getContract = async (callerWallet: any, contractAddress: string):Promise<ethers.Contract> => {
    const provider = new ethers.providers.Web3Provider(callerWallet.provider)
    const signer = provider.getSigner(callerWallet.accounts[0].address);

    const myContract = new ethers.Contract(contractAddress, localenv.contract.instanceAbi, signer);
    return myContract;
}

/* withdraw */
export const withdrawBalance = async (callerWallet: any, contractAddress: string): Promise<any> => {
    const myContract = await getContract(callerWallet, contractAddress)
    await myContract.withdraw()
}

/* begin claim period */
export const startClaimPeriod = async (callerWallet: any, contractAddress: string) => {
    const myContract = await getContract(callerWallet, contractAddress)
    await myContract.turnOnClaimPeriod()
}

/* begin mint period */
export const startMintPeriod = async (callerWallet: any, contractAddress: string) => {
    const myContract = await getContract(callerWallet, contractAddress)
    await myContract.turnOffClaimPeriodAndTurnOnMintPeriod()
}

/* end mint period */
export const endMintPeriod = async (callerWallet: any, contractAddress: string) => {
    const myContract = await getContract(callerWallet, contractAddress)
    await myContract.turnOffMintPeriod()
}

export const changeBaseURI = async (callerWallet: any, contractAddress: string, newUri: string) => {
    const myContract = await getContract(callerWallet, contractAddress)
    await myContract.changeBaseUri(newUri)
} 

export const changePrice = async (callerWallet: any, contractAddress: string, newPrice: string) => {
    const myContract = await getContract(callerWallet, contractAddress)
    await myContract.changePrice(utils.parseUnits(newPrice, "wei"));
}

export const changeMasterAddress = async (callerWallet: any, contractAddress: string, newMasterAddress: string) => {
    const myContract = await getContract(callerWallet, contractAddress)
    await myContract.transferOwnership(newMasterAddress);
}

export const getIsClaimPeriod = async (callerWallet: any, contractAddress: string) => {
    const myContract = await getContract(callerWallet, contractAddress);
    await myContract.isClaimPeriod();
}

export const getIsMintPeriod = async (callerWallet: any, contractAddress: string) => {
  const myContract = await getContract(callerWallet, contractAddress);
  await myContract.isMintPeriod();
}
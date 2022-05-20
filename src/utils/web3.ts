import { BigNumber, ethers } from 'ethers'
import { ContractCreationProps, WhitelistProps, ContractCreationReturn } from '../model/types'

import { CONFIG } from './config'
import apiClient from './apiClient'
const localenv = CONFIG.DEV;

/* call when new contract is created to update backend */
export const whitelist = async (props: WhitelistProps) => {
    return apiClient.post(
        localenv.api.paths.whitelist, props,
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
export const getNewLaunchedContract = async (masterAddress: string, name: string, symbol: string): Promise<string> => {
    const request_data = {
        "masterAddress": masterAddress,
        "name": name,
        "symbol": symbol
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

/* generate a new smart contract from user input */
export const generateNewContract = (callerWallet: any, merkleRoot: string, props: ContractCreationProps): Promise<ContractCreationReturn> => {
    return new Promise( async (resolve, reject ) => {
        const provider = new ethers.providers.Web3Provider(callerWallet.provider)
        const signer = provider.getSigner(callerWallet.accounts[0].address);
        const FactoryContract = new ethers.Contract(localenv.contract.factory_address, localenv.contract.factory_abi, signer);
        
        console.log("generating...")
        await FactoryContract.createContract(
        props.name, // name
        props.symbol, // symbol
        props.baseuri, // base URI
        merkleRoot, // merkle root
        props.maxSupply, // max supply
        props.price, // price
        props.maxMintsPerPerson, // max mint per person
        props.masterAddress // master address
        ).catch((error: Error) => {
            reject(error.message);
        })

        FactoryContract.on("ERC721RandomCreated", (name: string, symbol: string, instance: any, masterAddress: any) => {
            resolve ({
                "name": name,
                "symbol": symbol,
                "instance": instance,
                "masterAddress": masterAddress
            })
        })
    })
}

/* get the merkle root before generating smart contract */
export const getMerkleRoot = async (whitelistAddresses: string[]):Promise<string> => {
    const request_data = {
        "whitelistedAddresses" : whitelistAddresses,
    }

    return apiClient.post(
        localenv.api.paths.getMerkleRoot, request_data, 
        {
            headers: {"Content-Type": "application/json"}
        }
    ).then(function(response) {
        console.log(response.data)
        return Promise.resolve(response.data)
    }).catch(function(error) {
        return Promise.reject("Error getting merkle root")
    });
}

/* Master Address only Methods */

/* withdraw */
export const withdrawBalance = async (callerWallet: any, contractAddress: any): Promise<any> => {
    const provider = new ethers.providers.Web3Provider(callerWallet.provider)
    const signer = provider.getSigner(callerWallet.accounts[0].address);
    // needs bytecode or abi to call ethers contract
    const myContract = new ethers.Contract(contractAddress, localenv.contract.instanceAbi, signer);
    await myContract.withdraw()
    .then
    ((response: any) => {
        console.log(response)
        return Promise.resolve({
            success: true,
            status: response
        })
    })
    .catch
    ((error: any) => {
        return Promise.reject({
            success: false,
            status: error
        })
    })
}

/* begin claim period */
export const startClaimPeriod = async (callerWallet: any, contractAddress: string) => {
    const provider = new ethers.providers.Web3Provider(callerWallet.provider)
    const signer = provider.getSigner(callerWallet.accounts[0].address);

    const myContract = new ethers.Contract(contractAddress, localenv.contract.instanceAbi, signer);
    myContract.turnOnClaimPeriod()
}

/* begin mint period */
export const startMintPeriod = async (callerWallet: any, contractAddress: string) => {
    const provider = new ethers.providers.Web3Provider(callerWallet.provider)
    const signer = provider.getSigner(callerWallet.accounts[0].address);

    const myContract = new ethers.Contract(contractAddress, localenv.contract.instanceAbi, signer);
    myContract.turnOffClaimPeriodAndTurnOnMintPeriod()
}


/* end mint period */
export const endMintPeriod = async (callerWallet: any, contractAddress: string) => {
    const provider = new ethers.providers.Web3Provider(callerWallet.provider)
    const signer = provider.getSigner(callerWallet.accounts[0].address);

    const myContract = new ethers.Contract(contractAddress, localenv.contract.instanceAbi, signer);
    myContract.turnOffMintPeriod()
}

export const changeBaseURI = async (callerWallet: any, contractAddress: string, newUri: string) => {
    const provider = new ethers.providers.Web3Provider(callerWallet.provider)
    const signer = provider.getSigner(callerWallet.accounts[0].address);

    const myContract = new ethers.Contract(contractAddress, localenv.contract.instanceAbi, signer);
    myContract.changeBaseUri(newUri)
} 

export const changePrice = async (callerWallet: any, contractAddress: string, newPrice: BigNumber) => {
    const provider = new ethers.providers.Web3Provider(callerWallet.provider)
    const signer = provider.getSigner(callerWallet.accounts[0].address);

    const myContract = new ethers.Contract(contractAddress, localenv.contract.instanceAbi, signer);
    myContract.changePrice(newPrice)
}

export const changeMasterAddress = async (callerWallet: any, contractAddress: string, newMasterAddress: string) => {
    const provider = new ethers.providers.Web3Provider(callerWallet.provider)
    const signer = provider.getSigner(callerWallet.accounts[0].address);

    const myContract = new ethers.Contract(contractAddress, localenv.contract.instanceAbi, signer);
    myContract.transferOwnership(newMasterAddress);

    /* need to change owner in regulus backend */
} 
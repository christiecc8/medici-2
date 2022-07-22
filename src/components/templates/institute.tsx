import React from 'react'
import FontPicker from 'font-picker-react'
import { BsTwitter } from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { FaDiscord } from 'react-icons/fa'
import { Chain, Claim, Contract } from '../../model/types'
import useWallet from '../../hooks/useWallet'
import { getThumbnails } from '../../utils/reservations'
import { API_ENDPOINT, API_PATHS } from '../../utils/config'
import { getContract, verifyMerkleProof } from '../../utils/web3'
import { getContractClaimStatus, getContractCover } from '../../utils/retrieve'
import { GET_CHAIN_BY_ID } from '../../model/chains'
import FeaturedCollectionCard from '../../FeaturedCollectionCard'
import InfoBox from './InfoBox'


interface FreeTierProps {
  claim: Claim;
  contractName?: string;
  isPreview: boolean;
}

const Institute: React.FC<FreeTierProps> = ({
  claim,
  contractName,
  isPreview,
}) => {
  const { wallet } = useWallet();

  const connectedWallet = wallet?.accounts[0];

  const [name, setName] = React.useState<string>();
  const [contract, setContract] = React.useState<Contract>();
  const [masterAddress, setMasterAddress] = React.useState<string>();
  const [cover, setCover] = React.useState<string>();
  const [thumbnails, setThumbnails] = React.useState<string[]>();
  const [isVerified, setIsVerified] = React.useState<boolean>();
  const [verifiedProof, setVerifiedProof] = React.useState<string>();
  const [contractStatus, setContractStatus] = React.useState<string>();
  const [projectChain, setProjectChain] = React.useState<Chain>();


  const getContractStatus = React.useCallback(async () => {
    if (contract && projectChain) {
      try {
        const { success, status } = await getContractClaimStatus(contract.name, projectChain.id.toString())
        if (success) {
          setContractStatus(status);
        }
      } catch {
        alert('Could not get contract status');
      }
    }
  }, [contract, projectChain])

  const isAllowlistMember = React.useCallback(async () => {
    if (connectedWallet && contract) {
      try {
        const { success, merkleProof } = await verifyMerkleProof(contract.name, connectedWallet.address)
        setIsVerified(success);
        setVerifiedProof(merkleProof);
      } catch {
        setIsVerified(false)
      }
    }
  }, [connectedWallet, contract])

  const getName = React.useCallback(async () => {
    if (claim && contract && projectChain) {
    const currContract = await getContract(claim.contract, projectChain)
    const collectionName = await currContract.name()
    setName(collectionName)
    }
  }, [claim, contract, projectChain])

  const getContractOwner = React.useCallback(async () => {
    if (claim && contract && projectChain) {
    const currContract = await getContract(claim.contract, projectChain)
    const contractOwner = await currContract.masterAddress()
    setMasterAddress(contractOwner)
    }
  }, [claim, contract, projectChain])

  const getCoverImage = React.useCallback(async () => {
    if (contractName) {
      const res = await getContractCover(contractName)
      setCover(res);
    }
  }, [contractName]);

  const getCollectionThumbnails = React.useCallback(async () => {
    try {
      if (contractName) {
        const res = await getThumbnails(contractName);
        setThumbnails(res);
      }
    } catch (error: any) {
     console.log(error.message)
    } 
  }, [contractName])


  React.useEffect(() => {
    if (contractName && !name && !masterAddress && !cover && !contractStatus) {
      getName();
      getContractOwner();
    }
    getCoverImage();
    if (contractName && !isPreview) {
      isAllowlistMember()
    } 
    if (contract && !contractStatus) {
      getContractStatus()
    }
    if (contractName && !thumbnails) {
      getCollectionThumbnails()
    }
    if (contract && !projectChain) {
      setProjectChain(GET_CHAIN_BY_ID(parseInt(contract.chainid)))
    }
  }, [
    getName,
    getContractOwner,
    getCoverImage,
    isVerified,
    isAllowlistMember,
    contractStatus,
    getContractStatus,
    setContractStatus,
    contractName,
    contract,
    isPreview,
    cover,
    thumbnails,
    getCollectionThumbnails,
    masterAddress,
    name,
    projectChain,
    setProjectChain
  ]);

  React.useEffect(() => {
    ;(async () => {
      if (contractName) {
      const params = new URLSearchParams({
        collection: contractName
      })
      const headers = new Headers()
      headers.set('Content-Type', 'application/json')
      const res = await fetch(`${API_ENDPOINT}${API_PATHS.GET_CONTRACT_BY_NAME}?` + params, {
        method: 'GET',
        headers,
      }).then((res) => {
        if (res.status === 200) {
          return res.json()
        } else {
          throw new Error(res.statusText)
        }
      }).catch((error) => {
        console.log(error)
      })
      if (res !== undefined) {
        const {
          name,
          symbol,
          masteraddress,
          contractaddress,
          txhash,
          chainid,
          claimsstart,
          mintstart,
        } = res
        setContract({
          name,
          symbol,
          masteraddress,
          contractaddress,
          txhash,
          chainid,
          claimsstart,
          mintstart
        })
      }
    }
    })()
  }, [contractName])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-black relative md:overflow-hidden apply-font">
      <div className="hidden">
        <FontPicker
          activeFontFamily={(claim.fontFamily as string) ?? undefined}
          apiKey={process.env.REACT_APP_GOOGLE_FONTS_API_KEY!}
        />
      </div>
      <div
        className="absolute z-0 min-h-full w-full left-0 top-0"
        style={{
          background: `${"#FFFFFF"}`,
        }}
      />
      <div className="flex flex-col items-center relative z-1 w-full h-full scrollbar-hide overflow-x-hidden mb-12">
        <div className="drop-shadow-lg items-center flex flex-col w-full max-h-[550px] overflow-x-clip h-[500px]">   
          <div className="relative w-full h-full aspect-square object-cover overflow-hidden">
            <img src={cover} className="block w-full h-full aspect-video object-cover blur-sm"/>
          </div>
          <div className="absolute h-full left-0 top-0 aspect-square md:aspect-video w-full bg-gradient-to-b from-transparent to-black/80 drop-shadow-md overflow-hidden"></div>
            <div className="w-[400px] h-[400px] mt-10 object-center absolute overflow-hidden drop-shadow-xl bg-white z-3">
              <img src={cover} className="w-full h-full object-cover"/>
            </div>
        </div>
        <div className="w-full flex flex-col m-5 px-10 py-5">
        <div className="flex flex-col lg:flex-row gap-1">
          <div className="mx-5 space-y-5 mb-10 md:w-3/4">
            <h1 className="text-5xl font-bold leading-relaxed">{contractName} { claim.artist && `by ${claim.artist}`}</h1>
              <div>
              {claim.description}
              </div>
            <div className="flex items-center space-x-2">
                  {claim.discord && (
                    <a
                      href={claim.discord}
                      target="_blank"
                      rel="nofollow, noreferrer"
                    >
                      <FaDiscord size="20" />
                    </a>
                  )}
                  {claim.email && (
                    <a href={claim.email} target="_blank" rel="nofollow, noreferrer">
                      <HiOutlineMail size="20" />
                    </a>
                  )}
                  {claim.twitter && (
                    <a
                      href={claim.twitter}
                      target="_blank"
                      rel="nofollow, noreferrer"
                    >
                      <BsTwitter size="20" />
                    </a>
                  )}
                </div>
            </div>
            <div className="m-5">
              {contract && <InfoBox contract={contract}/>}
            </div>
          </div>
          <h1 className="text-4xl mx-5 my-10 font-bold items-center md:items-start">Collection Assets</h1>
            <div className="flex flex-col w-4/5 md:w-full md:grid md:grid-cols-3 gap-5">
            {thumbnails && 
              (Object.keys(thumbnails).map((i: string) => (
                  <FeaturedCollectionCard
                    imageURL={thumbnails[parseInt(i)]}
                    index={parseInt(i)}
                    contractName={contractName!}
                    colorhex={claim.primaryColor!}
                  />
            ))) } 
            </div>
      </div>
    </div>
  </div>
  );
};

export default Institute;

import React from 'react'
import FontPicker from 'font-picker-react'
import { BsTwitter } from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { FaDiscord } from 'react-icons/fa'
import { Chain, Claim, Contract } from '../../model/types'
import useWallet from '../../hooks/useWallet'
import { getOriginals } from '../../utils/retrieve'
import { API_ENDPOINT, API_PATHS } from '../../utils/config'
import { getContract, verifyMerkleProof } from '../../utils/web3'
import { getContractClaimStatus, getContractCover } from '../../utils/retrieve'
import { GET_CHAIN_BY_ID } from '../../model/chains'
import FeaturedCollectionCard from '../../FeaturedCollectionCard'
import InfoBox from './InfoBox'
import EtherscanLogo from '../svgComponents/EtherscanLogo'
import '../../index.css'


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

  const showCover = ((claim.bgColor!.toString() === "true") ? true : (claim.bgColor!.toString() === "false") ? false : true)

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
        const res = await getOriginals(contractName);
        setThumbnails(res);
      }
    } catch (error: any) {
     console.log(error.message)
    } 
  }, [contractName])

  const setCoverFromThumbnail = (index: string) => {
    setCover(thumbnails![parseInt(index)])
  }


  React.useEffect(() => {
    if (contractName && !name && !masterAddress && !cover && !contractStatus) {
      getName();
      getContractOwner();
    }
    // getCoverImage();
    if (contract && !contractStatus) {
      getContractStatus()
    }
    // getCollectionThumbnails()
    if (contract && !projectChain) {
      setProjectChain(GET_CHAIN_BY_ID(parseInt(contract.chainid)))
    }
  }, [
    getName,
    getContractOwner,
    getCoverImage,
    isVerified,
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
    if (!cover) {
      getCoverImage();
    }
    if (!thumbnails) {
      getCollectionThumbnails()
    }
  }, [contractName, cover, thumbnails, getCoverImage, getCollectionThumbnails])

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
    <div className="w-full h-full flex flex-col items-center justify-center text-black relative md:overflow-hidden font-helvetica">
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
        <div className="drop-shadow-none items-center flex flex-col w-full max-h-[550px] overflow-x-clip h-[500px]">   
          <div className="relative w-full h-full aspect-square object-cover overflow-hidden">
            { showCover ? <img src={cover} className="block w-full h-full aspect-video object-cover blur-sm"/> : <div className="block w-full h-full object-cover bg-[#F2F2F2]"/>}
          </div>
            { showCover && <div className="absolute h-full left-0 top-0 aspect-square md:aspect-video w-full bg-gradient-to-b from-transparent to-black/80 drop-shadow-md overflow-hidden"/>}
            <div className="w-[400px] h-[400px] mt-10 object-center absolute overflow-hidden drop-shadow-xl bg-white z-3">
              <img src={cover} className="w-full h-full object-cover"/>
            </div>
        </div>
        <div className="w-full flex flex-col m-5 px-10 py-5">
        <div className="flex flex-col lg:flex-row gap-1">
          <div className="mx-5 space-y-2 mb-10 md:w-3/4">
            <h1 className="font-bold text-6xl apply-font">{contractName}</h1>
            <h2 className="uppercase text-3xl">{ claim.artist && `${claim.artist}`}</h2>
          <div className="mt-5">
          {claim.description}
          </div>
              <div className="space-y-5">
                <h1 className="text-4xl font-bold items-center md:items-start mt-10 mb-5">Collection Links</h1>
                <a href={`${projectChain?.etherscanUrl}/address/${claim!.contract}`}
                    target="_blank"
                    rel="nofollow, noreferrer">
                  <div className="inline-flex gap-2 text-[#8B8B8B] hover:text-black transition-all ease-in">
                    <EtherscanLogo/>View on Etherscan
                  </div>
                <div className="flex items-center space-x-2 mt-2">
                {claim.discord && (
                <div className="gap-2 text-[#8B8B8B] hover:text-black transition-all ease-in">
                  <a
                    href={claim.discord}
                    target="_blank"
                    rel="nofollow, noreferrer"
                  >
                    <FaDiscord size="25"
                    className="social-icon"/>
                  </a>
                </div>
                )}
                {claim.email && (
                <div className="gap-2 text-[#8B8B8B] hover:text-black transition-all ease-in">
                  <a href={claim.email} target="_blank" rel="nofollow, noreferrer">
                    <HiOutlineMail size="25"
                    className="social-icon"/>
                  </a>
                </div>
                )}
                {claim.twitter && (
                <div className="gap-2 text-[#8B8B8B] hover:text-black transition-all ease-in">
                  <a
                    href={claim.twitter}
                    target="_blank"
                    rel="nofollow, noreferrer"
                  >
                    <BsTwitter size="25"
                    className="social-icon"/>
                  </a>
                </div>
                )}
              </div></a>
              </div>
            </div>
            <div className="m-5">
              {contract && <InfoBox contract={contract} colorhex={claim.primaryColor!} secondarycolorhex={claim.secondaryColor!}/>}
            </div>
          </div>
          {thumbnails && <h1 className="text-4xl mx-5 font-bold items-center md:items-start">Collection Assets</h1>}
            <div className="flex flex-col w-4/5 md:w-full md:grid md:grid-cols-3 gap-5">
            {thumbnails && 
              (Object.keys(thumbnails).map((i: string) => (
                <div onClick={() => setCoverFromThumbnail(i)}>
                  <FeaturedCollectionCard
                    imageURL={thumbnails[parseInt(i)]}
                    index={parseInt(i)}
                    contractName={contractName!}
                    colorhex={claim.primaryColor!}
                    secondarycolorhex={claim.secondaryColor!}
                  />
                </div>
            ))) } 
            </div>
      </div>
    </div>
  </div>
  );
};

export default Institute;

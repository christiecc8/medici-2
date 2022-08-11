import { ethers } from 'ethers';
import React from 'react';
import FontPicker from 'font-picker-react';
import { BsTwitter } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { FaDiscord } from 'react-icons/fa';
import { Claim, Chain } from '../../model/types';
import useWallet from '../../hooks/useWallet';
import { CONFIG } from '../../utils/config';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import {
  getContractCover,
  getContractAudioSamples,
} from '../../utils/retrieve';
import { getContractClaimStatus } from '../../utils/retrieve';
import { getContract, verifyMerkleProof, getContractForTransactions } from '../../utils/web3';
import { GET_CHAIN_BY_ID } from '../../model/chains';
import { utils } from 'ethers';

interface MusicProps {
  claim: Claim;
  contractName?: string;
  chainid?: Chain;
  isPreview: boolean;
}

type AudioSamples = {
  playlist: Array<string>;
  currentPlayingIndex: number;
  nextPlayingIndex: number;
};

const abi = [
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function name() public view returns (string memory)',
  'function masterAddress() public view returns (string memory)',
  'function mint(address account,uint256 numOfTokensToMint) external payable',
];
// const provider = new ethers.providers.JsonRpcProvider(
//   'https://opt-mainnet.g.alchemy.com/v2/aZAch5n6Co6vvepI37ogK-QLiCmofL04'
// )
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.ankr.com/eth_goerli'
);

const Music: React.FC<MusicProps> = ({ claim, contractName, chainid, isPreview }) => {
  const { wallet, connect, setChain } = useWallet();

  const connectedWallet = wallet?.accounts[0];

  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.up('md'));

  const audioElementRef = React.useRef<HTMLAudioElement>();

  const [playing, setPlaying] = React.useState(false);
  const [name, setName] = React.useState<string>();
  const [masterAddress, setMasterAddress] = React.useState<string>();
  const [cover, setCover] = React.useState<string>();
  const [audio, setAudio] = React.useState<AudioSamples>();
  const [minting, setMinting] = React.useState<boolean>(false);
  const [txHash, setTxHash] = React.useState<string>();
  const [claiming, setClaiming] = React.useState<boolean>(false);
  const [claimTxHash, setClaimTxHash] = React.useState<string>();
  const [isVerified, setIsVerified] = React.useState<boolean>();
  const [verifiedProof, setVerifiedProof] = React.useState<string>();
  const [contractStatus, setContractStatus] = React.useState<string>();
  const [price, setPrice] = React.useState<string>();
  const [numMinted, setNumMinted] = React.useState<number>();
  const [totalSupply, setTotalSupply] = React.useState<number>();
  const projectChain = isPreview ? chainid : GET_CHAIN_BY_ID(parseInt(claim.chainid));

  const getContractStatus = React.useCallback(async () => {
    if (contractName && projectChain) {
      try {
        const { success, status } = await getContractClaimStatus(
          contractName,
          projectChain.id.toString()
        );
        if (success) {
          setContractStatus(status);
        }
      } catch {
        alert('Could not get contract status');
      }
    }
  }, [contractName, projectChain]);

  const isAllowlistMember = React.useCallback(async () => {
    if (contractName && connectedWallet) {
      try {
        const { success, merkleProof } = await verifyMerkleProof(
          contractName,
          connectedWallet.address
        );
        setIsVerified(success);
        setVerifiedProof(merkleProof);
      } catch {
        setIsVerified(false);
      }
    }
  }, [contractName, connectedWallet]);

  const getName = React.useCallback(async () => {
    const contract = await getContract(claim.contract, projectChain!);
    const collectionName = await contract.name();
    setName(collectionName);
  }, [claim]);

  const getContractOwner = React.useCallback(async () => {
    const contract = await getContract(claim.contract, projectChain!);
    const contractOwner = await contract.masterAddress();
    setMasterAddress(contractOwner);
  }, [claim]);

  const getCoverImage = React.useCallback(async () => {
    if (contractName) {
      const res = await getContractCover(contractName);
      setCover(res);
    }
  }, [contractName]);

  const getPrice = React.useCallback(async () => {
    const contract = await getContract(claim.contract, projectChain!);
    const price = await contract.price()
    setPrice(price);
  }, [projectChain, claim.contract]);

  const getAudioSamplesPlaylist = React.useCallback(async () => {
    if (contractName) {
      const res = await getContractAudioSamples(contractName);

      setAudio({
        playlist: res,
        currentPlayingIndex: 0,
        nextPlayingIndex: 1,
      });
    }
  }, [contractName]);

  const getContractDetails = React.useCallback(async () => {
    if (claim && projectChain) {
      const currContract = await getContract(claim.contract, projectChain)
      const numMinted = await currContract.totalSupply()
      setNumMinted(numMinted.toString())
      const totalSupply = await currContract.maxSupply()
      setTotalSupply(totalSupply.toString())
    }
  }, [claim, projectChain])


  const claimOnContract = async () => {
    if (
      wallet &&
      connectedWallet &&
      isVerified &&
      verifiedProof !== null &&
      projectChain
    ) {
      setClaiming(true);
      try {
        await setChain({ chainId: projectChain.hexId });
        // const walletProvider = new ethers.providers.Web3Provider(
        //   wallet.provider
        // );
        // const signer = walletProvider.getSigner(connectedWallet?.address);
        // const contract = new ethers.Contract(
        //   claim.contract,
        //   localenv.contract.instanceAbi,
        //   signer
        // );
        const contract = await getContractForTransactions(wallet, claim.contract);
        const price = await contract.price();
        const tx = await contract.claim(
          connectedWallet?.address,
          1,
          verifiedProof,
          {
            value: price,
            gasLimit: 9000000,
          }
        );
        const claimResponse = await tx.wait();
        setClaimTxHash(claimResponse.transactionHash);
      } catch (error: any) {
        if (error.message) {
          alert(error.message);
        } else {
          alert('Something went wrong, please try again!');
        }
      } finally {
        setClaiming(false);
      }
    }
  };

  const mint = async () => {
    if (
      wallet &&
      connectedWallet &&
      projectChain
    ) {
      setMinting(true);
      try {
        await setChain({ chainId: projectChain.hexId });
        // const walletProvider = new ethers.providers.Web3Provider(
        //   wallet.provider
        // );
        // const signer = walletProvider.getSigner(connectedWallet?.address);
        // const contract = new ethers.Contract(claim.contract, abi, signer);
        const contract = await getContractForTransactions(wallet, claim.contract);
        const tx = await contract.mint(connectedWallet?.address, 1,{
          value: price,
          gasLimit: 9000000,
        })
        const mintResponse = await tx.wait();

        setTxHash(mintResponse.transactionHash);
      } catch (error: any) {
        if (error.message) {
          alert(error.message);
        } else {
          alert('Something went wrong, please try again!');
        }
      } finally {
        setMinting(false);
      }
    }
  };

  React.useEffect(() => {
    if (contractName && !name && !masterAddress && !cover) {
      getName();
      getContractOwner();
      getCoverImage();
      getAudioSamplesPlaylist();
    }
    if (contractName && !isPreview) {
      isAllowlistMember();
    }
    if (contractName && !contractStatus) {
      getContractStatus()
    }
    if (contractName && !numMinted) {
      getContractDetails()
    }
  }, [
    getName,
    getContractOwner,
    getCoverImage,
    getAudioSamplesPlaylist,
    contractName,
    cover,
    masterAddress,
    name,
    isAllowlistMember,
    isPreview,
    contractStatus,
    getContractStatus,
    getContractDetails,
    totalSupply,
    numMinted
  ]);

  React.useEffect(() => {
    if (wallet) {
      getPrice();
    }
  }, [wallet, getPrice]);

  React.useEffect(() => {
    if (audioElementRef.current) {
      if (playing) {
        setTimeout(() => {
          audioElementRef &&
            audioElementRef.current &&
            audioElementRef.current.play();
        }, 200);
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [playing]);

  return (
    <div className="w-full md:min-h-screen h-full flex flex-col md:flex-row items-center justify-between text-white relative md:overflow-hidden px-0 apply-font">
      {/* Added so that the page is rendered using the font */}
      <div className="hidden">
        <FontPicker
          activeFontFamily={(claim.fontFamily as string) || ''}
          apiKey={process.env.REACT_APP_GOOGLE_FONTS_API_KEY!}
        />
      </div>
      <div
        className="absolute z-0 min-h-full w-full left-0 top-0"
        style={{
          background: `linear-gradient(180deg, ${claim.primaryColor} 0%, ${claim.secondaryColor} 100%)`,
          filter: 'blur(200px)',
        }}
      />
      {
        <header
          className={`${
            isPreview ? 'absolute' : 'fixed'
          } top-0 left-0 flex items-start justify-between w-full p-4`}
        >
          <div className="flex flex-1 items-center space-x-2 w-full z-30">
            {claim.discord && (
              <a
                href={claim.discord}
                target="_blank"
                rel="nofollow, noreferrer"
              >
                <FaDiscord size="30" />
              </a>
            )}
            {claim.email && (
              <a href={`mailto:${claim.email}`} target="_blank" rel="nofollow, noreferrer">
                <HiOutlineMail size="30" />
              </a>
            )}
            {claim.twitter && (
              <a
                href={(claim.twitter.endsWith(".com")) ? claim.twitter : `https://twitter.com/${claim.twitter}`}
                target="_blank"
                rel="nofollow, noreferrer"
              >
                <BsTwitter size="30" />
              </a>
            )}
          </div>
          <div className="flex-1 text-2xl">{price && `${utils.formatEther(price)} ETH`}</div>
          {contractStatus === 'none' && (
            <button
            className="p-4 rounded-full bg-[#1b1a1f] text-white w-36 mx-auto disabled:bg-gray-500 drop-shadow-lg"
          >
          Mint not active
          </button>
          )}
          {contractStatus === 'claim' && 
          ( isVerified ? ( claimTxHash ? (
            <a
              className="p-4 rounded-2xl text-sm bg-emerald-800 text-white mx-auto"
              href={`${projectChain?.etherscanUrl}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              Success: Check transaction
            </a>
          ) : (<button
            className="p-4 rounded-full bg-[#1b1a1f] text-white w-36 mx-auto disabled:bg-gray-500 drop-shadow-lg"
            onClick={connectedWallet ? () => claimOnContract() : () => connect({})}
            disabled={claiming}
          >
            {connectedWallet
              ? claiming
                ? 'Claiming...'
                : 'Claim Now'
              : 'Connect Wallet'}
          </button>)) : (<button
            className="p-4 rounded-full bg-[#1b1a1f] text-white w-36 mx-auto disabled:bg-gray-500 drop-shadow-lg"
          >
          Mint not active
          </button>))
          }
          {contractStatus === 'mint' && 
          ( txHash ? (
            <a
              className="p-4 rounded-2xl text-sm bg-emerald-800 text-white mx-auto"
              href={`${projectChain?.etherscanUrl}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              Success: Check transaction
            </a>
          ) : (<button
            className="p-4 rounded-full bg-[#1b1a1f] text-white w-36 mx-auto disabled:bg-gray-500 drop-shadow-lg"
            onClick={connectedWallet ? () => mint() : () => connect({})}
            disabled={minting}
          >
            {connectedWallet
              ? minting
                ? 'Minting...'
                : 'Mint Now'
              : 'Connect Wallet'}
          </button>))}
        </header>
      }
      <div
        className={`flex flex-col items-start relative z-1 w-full md:w-1/2 lg:w-1/3 h-full my-20 p-5 md:mt-0 lg:mt-20 ${
          isPreview ? 'md:px-6' : 'md:px-12'
        } scrollbar-hide md:overflow-auto`}
      >
        <h1 className="text-6xl mb-4 break-all">{name}</h1>
        {claim.artist && (
          <div className="flex items-center justify-between mb-12 w-full">
            <h6 className="uppercase text-xl">{claim.artist ?? ''}</h6>
          </div>
        )}
        <div className="flex items-center justify-between mb-12">
          {claim.description}
        </div>
        <div className="flex flex-col justify-between leading-10 text-white/60 w-full">
          <h5 className="text-xl text-white mb-2">Details</h5>
          <table className="w-full">
            <tbody>
              <tr>
                <td>Contract Address</td>
               
                <td className="text-right text-white">
                <a
                  href={`${projectChain!.etherscanUrl}/address/${
                    claim!.contract
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                {claim?.contract?.slice(0, 6)}...{claim?.contract?.slice(-6)}
                </a>
                </td>
              </tr>
              <tr>
                <td>Contract Type</td>
                <td className="text-right">ERC-721</td>
              </tr>
              {masterAddress && (
                <tr>
                  <td>Contract Owner</td>
                  <td className="text-right text-white">
                    {masterAddress.slice(0, 6)}...{masterAddress.slice(-6)}
                  </td>
                </tr>
              )}
              <tr>
                <td>Blockchain</td>
                <td className="text-right">{projectChain!.label}</td>
              </tr>
              <tr>
                <td>Number Minted</td>
                <td className="text-right">{numMinted}/{totalSupply}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-around items-start relative z-1 w-full md:w-1/2 lg:w-2/3 h-[600px] lg:p-8 md:mt-20 pt-0 pb-2">
        <div className="h-full p-2 lg:p-10 rounded-xl bg-zinc-100/5 backdrop-blur-sm min-w-full lg:min-w-[655px]">
          <div className="relative flex w-full h-[250px] lg:h-[450px]">
            <div
              className="bg-black/95 min-w-[250px] w-[250px] lg:w-[450px] h-full animate-spin-slow overflow-hidden rounded-full relative flex items-center justify-center"
              style={{
                animationPlayState: playing ? 'running' : 'paused',
              }}
            >
              <img
                src={cover}
                className="object-cover z-10 h-full w-full"
                alt={name}
              />
              <div className="text-3xl text-white z-10 absolute top-8 break-all w-1/2 text-center">
                {/* {name} */}
              </div>
              <div className="text-xl text-white z-10 absolute bottom-8 break-all w-1/2 text-center">
                {/* {claim.artist} */}
              </div>
              <div className="h-[100px] w-[100px] rounded-full z-10 bg-black absolute " />
              <div className="h-[30px] w-[30px] rounded-full z-10 bg-gray-500 absolute " />
            </div>
            <img
              src="https://vinylblade.com/_nuxt/img/arm.f195722.png"
              className={`h-[250px] lg:h-[450px] transition-transform ease-in-out duration-500 ${
                playing ? 'rotate-45' : ''
              }`}
              style={{
                transformOrigin: '50% 25% 0',
              }}
              alt=""
            />
            <audio
              className="hidden"
              preload="auto"
              src={audio?.playlist[audio?.currentPlayingIndex]}
              ref={(element) =>
                (audioElementRef.current = element ?? undefined)
              }
              onEnded={() => {
                setAudio((val) => ({
                  playlist: val?.playlist as Array<string>,
                  currentPlayingIndex: val?.nextPlayingIndex as number,
                  nextPlayingIndex:
                    (val?.nextPlayingIndex as number) === val?.playlist.length
                      ? 0
                      : (val?.nextPlayingIndex as number) + 1,
                }));
              }}
              onPlay={() => {
                setPlaying(true)
              }}
              onPause={() => {
                setPlaying(false)
              }}
              onCanPlay={() => {
                audioElementRef?.current?.play();
              }}
            />
          </div>
        </div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            flexDirection: 'column',
            marginTop: '40px',
            padding: '0 10px 0 20px',
            height: '100%',
            ...(matchesMD && {
              justifyContent: 'flex-end',
            }),
          }}
        >
          <Button
            sx={{
              backgroundColor: '#000',
              color: 'white',
              height: '80px',
              borderRadius: '8px',
              ':hover': {
                backgroundColor: '#000',
              },
            }}
            size="large"
            onClick={() => setPlaying((val) => !val)}
          >
            <div
              className={`${
                playing ? 'bg-red-500' : 'bg-red-500/50'
              } h-2 w-2 rounded-full mr-2`}
            ></div>
            Start/Stop
          </Button>
          <a
            href={'https://launch.medicilabs.xyz'}
            target="_blank"
            rel="nofollow, noreferrer"
          >
            <div className="text-right text-sm text-white flex justify-end mt-4 whitespace-nowrap">
              powered by{' '}
              <img
                src="/logo.png"
                alt="Medici logo"
                width={20}
                className="mx-1"
              />
              Medici
            </div>
          </a>
        </Box>
      </div>
    </div>
  );
};

export default Music;

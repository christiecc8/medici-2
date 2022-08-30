import React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import FreeTier from '../components/templates/freetier';
import LowTier from '../components/templates/lowtier';
import { Chain, Claim, TemplateTier } from '../model/types';
import { API_ENDPOINT, API_PATHS } from '../utils/config';
import Music from '../components/templates/music';
import { getClaim } from '../utils/retrieve';

export const ClaimPageRenderer: React.FC<{
  claim: Claim;
  contractName?: string;
  chainid?: Chain;
  isPreview: boolean;
}> = ({ claim, contractName, chainid, isPreview }) => {
  switch (claim.template) {
    case TemplateTier.LOW:
      return (
        <LowTier
          claim={claim}
          contractName={contractName}
          isPreview={isPreview}
        />
      );
    case TemplateTier.MUSIC:
      return (
        <Music
          claim={claim}
          contractName={contractName}
          chainid={chainid}
          isPreview={isPreview}
        />
      );
    default:
      return (
        <FreeTier
          claim={claim}
          contractName={contractName}
          isPreview={isPreview}
        />
      );
  }
};

const ClaimPage: React.FC<{}> = () => {
  const [claim, setClaim] = React.useState<Claim>();

  const { name: contractName } = useParams();

  React.useEffect(() => {
    (async () => {
      if (contractName) {
      const res = await getClaim(contractName)
      console.log(res)
      if (res) {
        const {
          artist,
          description,
          backgroundcolor,
          collection_discord,
          collection_twitter,
          collection_email,
          contract,
          font,
          primarycolor,
          secondarycolor,
          tier,
          chainid,
          template,
        } = res;
        setClaim({
          artist,
          bgColor: backgroundcolor,
          discord: collection_discord,
          email: collection_email,
          twitter: collection_twitter,
          contract,
          description,
          fontFamily: font,
          primaryColor: primarycolor,
          secondaryColor: secondarycolor,
          tier,
          chainid,
          template,
        });
      }
    }})();
  }, [contractName]);
  if (!claim) {
    return null;
  }
  return (
    <Box sx={{ minHeight: '100vh', marginTop: '-64px' }}>
      <ClaimPageRenderer
        claim={claim}
        contractName={contractName as string}
        isPreview={false}
      />
    </Box>
  );
};

export default ClaimPage;

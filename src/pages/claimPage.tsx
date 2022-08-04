import React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import FreeTier from '../components/templates/freetier';
import LowTier from '../components/templates/lowtier';
import { Claim, TemplateTier } from '../model/types';
import { API_ENDPOINT, API_PATHS } from '../utils/config';
import Music from '../components/templates/music';

export const ClaimPageRenderer: React.FC<{
  claim: Claim;
  contractName?: string;
  isPreview: boolean;
}> = ({ claim, contractName, isPreview }) => {
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
      const params = new URLSearchParams({
        collection: contractName!,
      });
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      const res = await fetch(
        `${API_ENDPOINT}${API_PATHS.CLAIM_FETCH}?` + params,
        {
          method: 'GET',
          headers,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error(res.statusText);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
        } = res[0];
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
    })();
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

const axios = require('axios');

const PINATA_API_KEY = 'd0a95eff669ad0c8bc6c';
const PINATA_API_SECRET = ''; // Add your Pinata API secret here for full access

// Upload metadata to Pinata
async function uploadMetadata(metadata) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const res = await axios.post(url, metadata, {
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_API_KEY,
      // pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
  return res.data.IpfsHash;
}

// Example usage
(async () => {
  // Use your provided image CID
  const imageCID = 'bafybeicgdtah2266yh7nhedwjg7eh2eb5sw4ilcysoybxpe63rit6akdxe';
  const metadata = {
    name: 'CrabToken',
    description: 'A unique crab NFT.',
    image: `ipfs://${imageCID}`,
  };
  const metadataHash = await uploadMetadata(metadata);

  console.log('Metadata IPFS Hash:', metadataHash);
  // Use metadataHash as the token URI for your NFT contract
})();

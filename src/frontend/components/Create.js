import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Row, Form, Button } from 'react-bootstrap';

// Pinata API keys
const pinataApiKey = 'a9e537b0327d454669a7';
const pinataSecretApiKey = 'd1626b16f7bf16a9eee946605d3706aa3b4f7b1c3c20589d830438ccaab211a1';

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const font = document.createElement('link');
    font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap';
    font.rel = 'stylesheet';
    document.head.appendChild(font);
  }, []);

  const uploadToIPFS = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxContentLength: 'Infinity',
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      setImage(imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) {
      alert('Please fill all fields');
      return;
    }

    const metadata = { image, name, description };

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      const metadataURI = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      mintThenList(metadataURI);
    } catch (err) {
      console.error('Metadata upload failed:', err);
    }
  };

  const mintThenList = async (uri) => {
    try {
      await (await nft.mint(uri)).wait();
      const id = await nft.tokenCount();
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      const listingPrice = ethers.utils.parseEther(price.toString());
      await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
      alert('✅ NFT created and listed!');
    } catch (err) {
      console.error('Mint/List failed:', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#001f3f', minHeight: '100vh', paddingTop: '50px', fontFamily: 'Poppins, sans-serif' }}>
      <div className="container d-flex justify-content-center align-items-center">
        <div className="p-5 shadow" style={{
          backgroundColor: '#007bff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '700px',
          color: '#fff'
        }}>
          <h2 className="text-center mb-4 fw-bold">🎨 Create & List Your NFT</h2>
          <Row className="g-3">
            <Form.Group>
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                name="file"
                onChange={uploadToIPFS}
                className="bg-white text-dark rounded"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter NFT Name"
                className="rounded"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                as="textarea"
                placeholder="Enter NFT Description"
                className="rounded"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Enter Price in ETH"
                className="rounded"
              />
            </Form.Group>
            <div className="d-grid mt-3">
              <Button onClick={createNFT} variant="light" size="lg" className="fw-bold text-primary">
                🚀 Create & List NFT
              </Button>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Create;

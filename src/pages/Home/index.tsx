import styled from "styled-components";
import NavBar from "../../components/NavBar";
import WalletInfo from "../../components/WalletInfo";
import ChainNFT from "../../components/ChainNFT";
import { CHAIN_NAMES, CHAIN_TYPES } from "../../constants";
import { Footer } from "../../components/Footer";
import { ToolBar } from "../../components/ToolBar";
import { useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NormalButton } from "../../theme/components";

import { ethers } from 'ethers'; 
import ABI from "../../utils/abi.json";


const contractABI = ABI; 
const contractAddress = '0x00b3f7771DcEd47359fd03D768F1f10379CF7046'; 


const Wrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 104px);

  .backgroundWrapper {
    background-image: url("/assets/imgs/website_background.png");
    background-size: 100% auto;

    padding: 100px 0 50px 0;

    &:before {
      background-image: url("/assets/imgs/white-area-top.svg");
      padding: 14%;
      top: -27.7vw;
      position: absolute;
      width: 100%;
      display: block;
      content: "";
      background-repeat: none;
      background-position: center;
      background-size: cover;
      pointer-events: none;
    }
  }
`;

const ContentWrapper = styled.div`
  width: 80%;
  margin: auto;
`;

const Space = styled.div`
  position: relative;
  height: 100px;
`;

const HeaderTitle = styled.div`
  color: #fff;
  font-size: 36px;
  font-family: Futura-Bold;
  font-weight: 500;
`;

const HeaderText = styled.div`
  color: #fff;
  font-size: 18px;
  font-family: Futura;
  font-weight: 500;
`;

const NFT_INFO = [
  {
    img: "1.png",
    name: `Material World #19048`,
  },
  {
    img: "2.png",
    name: `Zeuz #895`,
  },
  {
    img: "3.png",
    name: `Zeuz #895`,
  },
  {
    img: "4.png",
    name: `Zeuz #895`,
  },
  {
    img: "5.png",
    name: `Zeuz #895`,
  },
  {
    img: "6.png",
    name: `Zeuz #895`,
  },
];
const Mintcard = styled.div`
  background: linear-gradient(109.66deg, #2535D9C9 9.12%, #E313748F 100.7%);
  
  border-radius:20px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding: 20px 10px;
  width:85%;
  gap:20px
`;

export const Home = () => {
  const { address: searchAddress } = useParams();
  const [block, setBlock] = useState(0);
  const navigate = useNavigate();

  const [quantityToMint, setQuantityToMint] = useState(1); // Assuming you want to mint 1 NFT, you can adjust this

  const walletState = useSelector((state: any) => state.wallet);
  const cardsState = useSelector((state: any) => state.cards);

  useEffect(() => {
    if (block != 0) toast.info("Updaing NFT data..");
  }, [block]);

  const isActiveChain = (chainId: string) => {
    if (!cardsState.filteredChains.length) return true;

    return cardsState.filteredChains.indexOf(chainId) !== -1;
  };

  const handleMint = async () => {
    try {
      // Check if MetaMask (or any other Ethereum-compatible wallet) is installed
      if (!window.ethereum) {
        toast.warning('Please install MetaMask or any Ethereum-compatible wallet to mint NFTs.');
        return;
      }
  
      // Check if the wallet is connected
      if (!walletState.isConnected) {
        // If not connected, prompt the user to connect their wallet
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          toast.success('Wallet connected successfully!');
        } else {
          toast.warning('Failed to connect the wallet.');
          return;
        }
      }
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      const network = await provider.getNetwork();
  
      if (network.chainId !== 137) {
        const result = await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // Polygon mainnet chain ID
        });
  
        if (result && result.error) {
          toast.warning('Please connect to Polygon mainnet to mint NFTs.');
          return;
        }
  
        // Wait for the chainChanged event to be emitted
        await window.ethereum.on('chainChanged');
  
        // Update the provider and signer after the network change
        const currentBlockNumber = await provider.getBlockNumber();
        provider._lastBlockNumber = currentBlockNumber; // Reset the events block
        await provider.getNetwork(); // Update network information
        signer.connect(provider);
  
        // Continue with the minting process
      }
  
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const to = await signer.getAddress();
      const quantity = quantityToMint;
  
      const tokenPriceWei = await contract.mint_price();
      console.log(tokenPriceWei);
  
      if (tokenPriceWei.gt(0)) {
        const balanceWei = await provider.getBalance(to);
  
        // Multiply tokenPriceWei by quantity using the BigNumber multiplication
        const totalValueWei = tokenPriceWei.mul(quantity);
  
        if (balanceWei.gte(totalValueWei)) {
          const tx = await contract.mint(to, quantity, { value: totalValueWei });
  
          await tx.wait();
  
          toast.success(`Successfully minted ${quantityToMint} NFT(s)`);
        } else {
          toast.warning('Insufficient funds. Please add funds to your account.');
        }
      } else {
        toast.warning('Token price must be greater than 0.');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Failed to mint NFT');
    }
  };
  

  const handleQuantityChange = (change) => {
    const newQuantity = quantityToMint + change;

    // Ensure quantity doesn't go below 0
    if (newQuantity >= 1) {
      setQuantityToMint(newQuantity);
    }
  };
  const gotomint = () => {
    navigate("/mint");
  };
  const gotoViewonft = () => {
    navigate("/gallery");
  };

  return (
    <>
      <Wrapper className="relative w-screen">
        <NavBar />

        <div
          className="container-fluid m-auto galelryHero md:pt-[100px] md:pb-[150px] !bg-cover !bg-left"
          style={{ background: 'url("/assets/imgs/Layer_1.png")' }}
        >
          <Space />
          <ContentWrapper>
            <div className="relative m-auto grid md:grid-cols-2 w-[90%] items-center">
              {/* style={{ width: "90%" }} */}
              <div>
                <HeaderTitle className="!text-5xl">
                  Cross-chain made easy
                </HeaderTitle>

                <HeaderText className="my-8 !text-xl">
                  Traverse any or all of your ONFTs with TraverseMyONFT, the user-friendly tool for cross-chain non-fungible asset management.
                </HeaderText>

                <HeaderText className="my-8 !text-lg">
                  Connect your wallet. If you have any ONFTs in your wallet, TraverseMyONFT will recognize them and will sort them based on the chain they're currently native to.
                  </HeaderText>

                    <div className="flex justify-center">
                    <NormalButton
                            className="!bg-white !rounded !text-black mr-3 hidden md:inline"
                            onClick={() => gotoViewonft()}
                        >
                            View my ONFTs 
                        </NormalButton>
                    </div>
              </div>

              <div>
                <img src="/assets/imgs/image7.png" />
              </div>
            </div>

            <div className="flex flex-row justify-evenly">
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/BASE.png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/Polygon (2).png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/Avalanche.png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/BNB Chain.png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/image 6.png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/Optimism Testnet.png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/image.png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/SCROLL.png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/BLAST.png" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/linea.svg" />
              <img className="w-[15%] md:w-[6%] rounded-full" src="/assets/imgs/chain/zk.png" />

            </div>

            <div className="relative m-auto grid md:grid-cols-2 w-[90%] items-center mt-[50px]">
              <div>
                <HeaderTitle>
                    To traverse your ONFTs
                </HeaderTitle>
                <HeaderText className="my-8">
                  1. Select an ONFT: Choose the ONFT you wish to traverse to another chain <br/>
                  2. Choose a Destination Chain: Select the blockchain you want to traverse to  <br/>
                  3. Confirm the Transfer: Review the details and proceed to confirm the transfer on your wallet  <br/>
                  4. Wait for Confirmation: The transaction will go through our LayerZero messaging protocol integration. Once the transaction is confirmed, the ONFT will appear on the destination blockchain.                
                </HeaderText>

                  <Mintcard>
                      <HeaderTitle className="text-center !text-2xl !font-thin">
                        Don't have any ONFTS? <br/> Mint an Airdop Hunter now!
                      </HeaderTitle>

                        <NormalButton
                          className="!bg-white !rounded !text-black mr-3 hidden md:inline"
                          onClick={() => gotomint()}
                        >
                          Start Minting
                      </NormalButton>
                    </Mintcard>
              
              </div>

              <div>
                <img className="" src="/assets/imgs/sec2.png" />
              </div>
            </div>

          </ContentWrapper>
        </div>

      </Wrapper>

      <Footer />
    </>
  );
};

export default Home;

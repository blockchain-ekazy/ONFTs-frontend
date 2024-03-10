import styled from "styled-components";
import NavBar from "../../components/NavBar";
import WalletInfo from "../../components/WalletInfo";
import ChainNFT from "../../components/ChainNFT";
import { CHAIN_NAMES, CHAIN_TYPES } from "../../constants";
import { Footer } from "../../components/Footer";
import { ToolBar } from "../../components/ToolBar";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NormalButton } from "../../theme/components";

import { ethers } from "ethers";
import ABI from "../../utils/abi.json";

const contractABI = ABI;
const contractAddress = "0x2b0cC84C99FA74AC4E0d6A71B5053E0e31413571";

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

export const Mint = () => {
  const { address: searchAddress } = useParams();
  const [block, setBlock] = useState(0);

  const [quantityToMint, setQuantityToMint] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [minttotal, setMinttotal] = useState(0);

  const walletState = useSelector((state: any) => state.wallet);
  const cardsState = useSelector((state: any) => state.cards);

  useEffect(() => {
    if (block != 0) toast.info("Updaing NFT data..");
  }, [block]);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        const supply = await contract.totalSupply();
        setTotalSupply(parseInt(supply.toString()));
      } catch (error) {
        console.error("Error fetching total supply:", error);
      }
    };

    // fetchTotalSupply();
  }, []);

  const isActiveChain = (chainId: string) => {
    if (!cardsState.filteredChains.length) return true;

    return cardsState.filteredChains.indexOf(chainId) !== -1;
  };

  const handleMint = async () => {
    try {
      // Check if MetaMask (or any other Ethereum-compatible wallet) is installed
      if (!window.ethereum) {
        toast.warning(
          "Please install MetaMask or any Ethereum-compatible wallet to mint NFTs."
        );
        return;
      }

      // Check if the wallet is connected
      if (!walletState.isConnected) {
        // If not connected, prompt the user to connect their wallet
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          toast.success("Wallet connected successfully!");
        } else {
          toast.warning("Failed to connect the wallet.");
          return;
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const network = await provider.getNetwork();

      if (network.chainId !== 80001) {
        const result = await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }], // Polygon mainnet chain ID
        });

        if (result && result.error) {
          toast.warning("Please connect to Polygon mainnet to mint NFTs.");
          return;
        }
      }

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const to = await signer.getAddress();
      const quantity = quantityToMint;

      const tokenPriceWei = await contract.getUSDPrice(100);
      console.log(tokenPriceWei);

      if (tokenPriceWei.gt(0)) {
        const balanceWei = await provider.getBalance(to);

        // Multiply tokenPriceWei by quantity using the BigNumber multiplication
        const totalValueWei = tokenPriceWei.mul(quantity);

        if (balanceWei.gte(totalValueWei)) {
          const tx = await contract.mint(to, quantity, {
            value: totalValueWei,
          });

          await tx.wait();

          toast.success(`Successfully minted ${quantityToMint} NFT(s)`);
        } else {
          toast.warning(
            "Insufficient funds. Please add funds to your account."
          );
        }
      } else {
        toast.warning("Token price must be greater than 0.");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT");
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantityToMint + change;

    // Ensure quantity doesn't go below 0
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantityToMint(newQuantity);
    }
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
                <HeaderTitle>
                  Stack your cross-chain <br /> transactions with the Airdrop{" "}
                  <br /> Hunter ONFT
                </HeaderTitle>

                <HeaderText className="my-8 !text-lg">
                  Cross-chain fungible token swaps are easy, but traversing your
                  non-fungible tokens has been a lot more complicated. And
                  frustrating. After all, who in their right mind wants to
                  interact with the block explorer just to make a cross-chain
                  transaction?
                  <br />
                  <br />
                  With your Airdrop Hunter and TraverseMyONFT, you can travel
                  the cross-chain NFT universe as often as you want, and you’ll
                  never have to worry about the block explorer again.
                  <br />
                  <br />
                  So if you want to build LayerZero protocol transaction history
                  in the easiest way possible, simply mint your Airdrop Hunter
                  and start traversing!
                </HeaderText>
              </div>

              <div className="w-[80%] h-fit mx-3 px-3 py-5 flex flex-col items-center justify-center rounded-2xl">
                <HeaderTitle className="text-center !text-3xl">
                  Mint your Airdrop Hunter ONFT
                </HeaderTitle>
                <HeaderText className="!text-lg text-center mb-3">
                  Max 10 per wallet. Mint fee is $1 USD equivalent in MATIC plus
                  gas
                </HeaderText>
                <img
                  className="w-[40%] h-[25%]"
                  alt="pic"
                  src="/assets/imgs/airdrophunter.png"
                />

                <div className="flex flex-row my-2 items-center">
                  <NormalButton
                    className="mr-3  md:inline !bg-white !text-black"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    -
                  </NormalButton>
                  <h3 className="text-white">{quantityToMint}</h3>
                  <NormalButton
                    className="ml-3  md:inline !bg-white !text-black"
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </NormalButton>
                </div>

                <NormalButton
                  className="mr-0  md:inline !bg-white !text-black"
                  onClick={handleMint}
                >
                  MINT
                </NormalButton>

                {/* <h3 className="text-white py-3">{totalSupply} / {minttotal}</h3> */}
                <h3 className="text-white py-3">0 / 100,000</h3>

                <div className="text-center">
                  <h3 className="text-white text-2xl">
                    Mint fee is $5 USD equivalent in Polygon MATIC, plus gas.
                  </h3>
                  <h4 className="text-white text-lg">
                    Don't have Polygon MATIC? No Problem!
                  </h4>
                  <h3 className="text-white text-lg">
                    You can use swaps to get the native tokens you need. Some
                    options include{" "}
                    <a
                      className="text-[#FC2947]"
                      href="https://stargate.finance/"
                      target="_blank"
                    >
                      Stargate finance
                    </a>
                    ,{" "}
                    <a
                      className="text-[#FC2947]"
                      href="https://simpleswap.io/"
                      target="_blank"
                    >
                      Simple Swap
                    </a>
                    ,{" "}
                    <a
                      className="text-[#FC2947]"
                      href="https://www.synapseprotocol.com/"
                      target="_blank"
                    >
                      Synapse Protocol
                    </a>
                    ,{" "}
                    <a
                      className="text-[#FC2947]"
                      href="https://omoswap.xyz/"
                      target="_blank"
                    >
                      OmoSwap
                    </a>
                    ,{" "}
                    <a
                      className="text-[#FC2947]"
                      href="https://cbridge.celer.network/"
                      target="_blank"
                    >
                      cBridge.
                    </a>
                  </h3>
                  <p className="text-white text-xs">
                    *TraverseMyONFT has no affiliation with any of the linked
                    swap sites, nor do we receive referral fees
                  </p>
                </div>
              </div>
            </div>
            <Space />

            <div className="flex flex-row justify-evenly">
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/BASE.png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/Polygon (2).png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/Avalanche.png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/BNB Chain.png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/image 6.png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/Optimism Testnet.png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/image.png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/SCROLL.png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/BLAST.png"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/linea.svg"
              />
              <img
                className="w-[15%] md:w-[6%] rounded-full"
                src="/assets/imgs/chain/zk.png"
              />
            </div>
          </ContentWrapper>
        </div>
      </Wrapper>

      <Footer />
    </>
  );
};

export default Mint;

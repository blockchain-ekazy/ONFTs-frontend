import styled from "styled-components";
import NavBar from "../../components/NavBar";
import WalletInfo from "../../components/WalletInfo";
import ChainNFT from "../../components/ChainNFT";
import { CHAIN_TYPES } from "../../constants";
import { Footer } from "../../components/Footer";
import { ToolBar } from "../../components/ToolBar";
import { Loader } from "../../components/Loader";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { WalletData } from "../../store/types";

import { ethers } from "ethers";
import ABI from "../../utils/abi.json";

const contractABI = ABI;
const contractAddress = "0x00b3f7771DcEd47359fd03D768F1f10379CF7046";

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
	margin-top: 150px;
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

export const Gallery = () => {
	const { address: searchAddress } = useParams();
	const [block, setBlock] = useState(0);

	// const [quantityToMint, setQuantityToMint] = useState(1); // Assuming you want to mint 1 NFT, you can adjust this

	const walletState = useSelector<any, WalletData>(
		(state: any) => state.wallet
	);
	const cardsState = useSelector((state: any) => state.cards);

	useEffect(() => {
		if (block != 0) toast.info("Updaing NFT data..");
	}, [block]);

	useEffect(() => {
		if (!walletState.isConnected)
			toast.warning("Connect your wallet to see your NFTs");
	}, [walletState]);

	const isActiveChain = (chainId: string) => {
		if (!cardsState.filteredChains.length) return true;

		return cardsState.filteredChains.indexOf(chainId) !== -1;
	};

	// TODO: Check if those fuctions below are no longer required and can be safely removed
	// const handleMint = async () => {
	//   try {
	//     // Check if MetaMask (or any other Ethereum-compatible wallet) is installed
	//     if (!window.ethereum) {
	//       toast.warning(
	//         "Please install MetaMask or any Ethereum-compatible wallet to mint NFTs."
	//       );
	//       return;
	//     }

	//     // Check if the wallet is connected
	//     if (!walletState.isConnected) {
	//       // If not connected, prompt the user to connect their wallet
	//       const accounts = await window.ethereum.request({
	//         method: "eth_requestAccounts",
	//       });
	//       if (accounts && accounts.length > 0) {
	//         toast.success("Wallet connected successfully!");
	//       } else {
	//         toast.warning("Failed to connect the wallet.");
	//         return;
	//       }
	//     }

	//     const provider = new ethers.providers.Web3Provider(window.ethereum);
	//     const signer = provider.getSigner();

	//     const network = await provider.getNetwork();

	//     if (network.chainId !== 137) {
	//       const result = await window.ethereum.request({
	//         method: "wallet_switchEthereumChain",
	//         params: [{ chainId: "0x89" }], // Polygon mainnet chain ID
	//       });

	//       if (result && result.error) {
	//         toast.warning("Please connect to Polygon mainnet to mint NFTs.");
	//         return;
	//       }

	//       // Wait for the chainChanged event to be emitted
	//       await window.ethereum.on("chainChanged");

	//       // Update the provider and signer after the network change
	//       const currentBlockNumber = await provider.getBlockNumber();
	//       provider._lastBlockNumber = currentBlockNumber; // Reset the events block
	//       await provider.getNetwork(); // Update network information
	//       signer.connect(provider);

	//       // Continue with the minting process
	//     }

	//     const contract = new ethers.Contract(
	//       contractAddress,
	//       contractABI,
	//       signer
	//     );

	//     const to = await signer.getAddress();
	//     const quantity = quantityToMint;

	//     const tokenPriceWei = await contract.mint_price();
	//     console.log(tokenPriceWei);

	//     if (tokenPriceWei.gt(0)) {
	//       const balanceWei = await provider.getBalance(to);

	//       // Multiply tokenPriceWei by quantity using the BigNumber multiplication
	//       const totalValueWei = tokenPriceWei.mul(quantity);

	//       if (balanceWei.gte(totalValueWei)) {
	//         const tx = await contract.mint(to, quantity, {
	//           value: totalValueWei,
	//         });

	//         await tx.wait();

	//         toast.success(`Successfully minted ${quantityToMint} NFT(s)`);
	//       } else {
	//         toast.warning(
	//           "Insufficient funds. Please add funds to your account."
	//         );
	//       }
	//     } else {
	//       toast.warning("Token price must be greater than 0.");
	//     }
	//   } catch (error) {
	//     console.error("Error minting NFT:", error);
	//     toast.error("Failed to mint NFT");
	//   }
	// };

	// const handleQuantityChange = (change) => {
	//   const newQuantity = quantityToMint + change;

	//   // Ensure quantity doesn't go below 0
	//   if (newQuantity >= 1) {
	//     setQuantityToMint(newQuantity);
	//   }
	// };

	return (
		<>
			<Wrapper className="relative w-screen">
				<NavBar />

				<div className="container m-auto">
					<ContentWrapper>
						<WalletInfo />

						{walletState.isConnected || searchAddress ? (
							<>
								<ToolBar block={block} setBlock={setBlock} />

								{Object.keys(CHAIN_TYPES).map((key: string, index: number) => (
									<ChainNFT
										key={`chainnfts${index}`}
										chainType={CHAIN_TYPES[key as keyof typeof CHAIN_TYPES]}
										walletAddress={
											searchAddress ? searchAddress : walletState.address
										}
										cards={NFT_INFO.slice(0, 5)}
										active={isActiveChain(
											CHAIN_TYPES[key as keyof typeof CHAIN_TYPES]
										)}
										block={block}
										setBlock={setBlock}
									/>
								))}
							</>
						) : (
							<Loader />
						)}
					</ContentWrapper>
				</div>

				<div className="flex flex-col justify-center items-center mt-5">
					<h1 className="text-white text-3xl">
						Don't see an ONFT you have in your wallet?{" "}
						<a className="text-[#E11075]" href="/request">
							{" "}
							Click here{" "}
						</a>{" "}
						to fill out the request form for us to add it!
					</h1>
				</div>
			</Wrapper>

			<Footer />
		</>
	);
};

export default Gallery;

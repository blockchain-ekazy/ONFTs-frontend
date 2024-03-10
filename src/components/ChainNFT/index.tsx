import styled from "styled-components";
import React from "react";
import { NotificationManager } from "react-notifications";
import { ReactComponent as SubstractSVG } from "../../assets/imgs/Subtract.svg";
import { CHAIN_COLORS, CHAIN_NAMES, CHAIN_TYPES } from "../../constants";
import NFTCard from "./NFTCard";
import { NormalButton } from "../../theme/components";
import TraverseModal from "../TraverseModal";
import { useEffect, useState, useRef } from "react";
import { getTokens } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { insertCardsArray } from "../../store/reducers/cards";
import { toast } from "react-toastify";

const Wrapper = styled.div`
	margin: 2rem 0;
	margin-bottom: 5rem;
	padding: 0%;
	.substractSVG {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 10;
	}
`;

const Title = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	border-top-left-radius: 1rem;
	border-bottom-right-radius: 1rem;
	// width: 18%;
	height: 35px;
	z-index: 1;
	color: white;
	font-size: 90%;
	padding-left: 2%;
	padding-right: 2%;

	@media screen and (max-width: 720px) {
		img {
			display: none;
		}
	}

	@media screen and (max-width: 500px) {
		font-size: 60%;
		height: 2rem;
		// width: -2rem;
		// top: -10px;
		// left: -0.8%;
		// border-top-right-radius: 1rem;
		// border-bottom-left-radius: 1rem;
		// img {
		//   display: none;
		// }
	}
`;

export const CheckBox = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	position: absolute;
	top: -1%;
	right: 5.2%;
	z-index: 10;
	font-size: 1.2rem;

	@media (max-width: 959px) {
		isplay: flex;
		align-items: center;
		cursor: pointer;
		position: absolute;
		top: -1%;
		right: 4%;
		z-index: 10;
		font-size: 1.2rem;
	}

	@media (max-width: 720px) {
		top: -3%;
		right: 2%;
		font-size: 0.9rem;
	}

	@media (max-width: 400px) {
		top: -5%;
		right: 1%;
		font-size: 0.8rem;
	}

	.m-checkbox__input {
		position: relative;
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		appearance: none;
		outline: none;
		background: #252224;
		cursor: pointer;
		border: 2px solid #ff0e64;
		top: 0.2rem;
		margin-left: 2%;

		@media (max-width: 1139px) {
			top: -0.1rem;
			width: 1.2rem;
			height: 1.2rem;
		}
		@media (max-width: 959px) {
			top: -0.2rem;
			width: 1.2rem;
			height: 1.2rem;
			left: 0.1rem;
		}

		@media (max-width: 720px) {
			top: -1%;
			left: -0.2rem;
			height: 1rem;
			width: 1rem;
		}

		@media (max-width: 670px) {
			top: -0.2rem;
			width: 0.9rem;
			height: 0.9rem;
			left: -0.2rem;
		}

		@media (max-width: 450px) {
			top: -0.4rem;
			width: 0.9rem;
			height: 0.9rem;
			left: -0.2rem;
		}

		@media (max-width: 360px) {
			top: -0.1rem;
			width: 0.8rem;
			height: 0.8rem;
			left: -0.1rem;
		}

		@media (max-width: 300px) {
			top: -0.3rem;
			width: 0.7rem;
			height: 0.7rem;
			left: -0.2rem;
		}

		&:checked::before {
			top: 2px;
			right: 2px;
			bottom: 2px;
			left: 2px;
		}

		&:before {
			content: " ";
			position: absolute;
			top: 50%;
			right: 50%;
			bottom: 50%;
			left: 50%;
			transition: all 0.1s;
			background: #ff0e64;
		}

		&:disabled {
			opacity: 0.3;
			cursor: not-allow;
		}
	}

	.m-checkbox__label {
		user-select: none;
		position: relative;
		flex-shrink: 0;
		padding: 0.5rem 0.5rem;
		color: #fff;
		cursor: pointer;
		top: 0.3rem;

		@media (max-width: 1139px) {
			font-size: 1rem;
			left: 1%;
			top: 0rem;
		}
		@media (max-width: 959px) {
			left: -0.1%;
		}

		@media (max-width: 720px) {
			left: -2%;
			font-size: 0.9rem;
		}

		@media (max-width: 670px) {
			left: -0.5rem;
		}
		@media (max-width: 450px) {
			font-size: 0.7rem;
			left: -0.1rem;
		}

		@media (max-width: 360px) {
			font-size: 0.7rem;
			left: -0.1rem;
		}
		@media (max-width: 300px) {
			font-size: 0.7rem;
			left: -0.2rem;
		}
	}
`;

const NFTWrapper = styled.div`
	// width: 99%;
	// height: 80%;
	// position: absolute;
	// left: 0;
	// top: 0;
	// z-index: 20;
	// top: 10%;
	padding-left: 5%;
	padding-right: 5%;
	overflow: auto;
`;

const TraverseBtn = styled(NormalButton)`
	position: sticky;

	margin-top: 0%;
	margin-bottom: 0%;
	left: 50%;
	transform: translateX(-50%);
	font-size: 1.1rem;

	@media screen and (max-width: 600px) {
		margin-top: 0%;
		margin-bottom: 0%;
		left: 50%;
		height: 30px;

		font-size: 80%;
	}
`;

export const ChainNFT = ({
	chainType,
	walletAddress,
	active,
	block,
	setBlock,
}: any) => {
	const walletState = useSelector((state: any) => state.wallet);
	// this state handle thes sticky behabior of traveler buttom
	const [isBottomVisible, setIsBottomVisible] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// handler the detection of buttom in the wrapper frame
	useEffect(() => {
		function handleScroll() {
			const wrapper = wrapperRef.current;
			const wrapperBottom = wrapper?.getBoundingClientRect().bottom; // Verificación adicional
			const windowHeight = window.innerHeight;
			setIsBottomVisible(wrapperBottom ? wrapperBottom <= windowHeight : false);
		}

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// this variable handle if you are the owner of the nft and can select it. change to true for debugging
	// default :  walletState.isConnected && walletAddress === walletState.address;
	const isMyWallet =
		walletState.isConnected && walletAddress === walletState.address;

	const cardsState = useSelector((state: any) => state.cards);
	const dispatch = useDispatch();

	const [showModal, setShowModal] = useState(false);
	const [cards, setCards] = useState<any>([]);

	const [showOneModal, setShowOneModal] = useState(false);
	const [selectCard, setSelectCard] = useState(null);

	const getSelectedChainCards = () => {
		return cardsState.selectedCards.filter(
			(card: any) => card.chainId === chainType
		);
	};

	const selectedCardsCount = getSelectedChainCards().length;

	const getCards = async () => {
		const res = await getTokens(walletAddress, chainType);

		if (!res?.data) return;
		setCards(res?.data);

		res?.data.forEach((item: any) => {
			dispatch(
				insertCardsArray({
					chainId: chainType,
					info: item,
				})
			);
		});
	};

	useEffect(() => {
		setCards([]);

		getCards();
	}, [chainType, walletAddress, block]);

	const onChangeSelectAll = (ev: any) => {
		const isChecked = ev.target.checked;

		const chainCards = cardsState.cardsArray.filter(
			(card: any) => card.chainId === chainType
		);

		if (isChecked && chainCards.length > 1) {
			if (
				chainCards[0].info.contractAddress !==
				chainCards[1].info.contractAddress
			) {
				NotificationManager.warning(
					"You can only select ONFTs from the same collection"
				);
				return;
			}
		}

		chainCards.forEach(({ info: card }: any) => {
			const id = `chainNFT${chainType}${card.tokenId}${card.contractAddress}`;

			const element = document.getElementById(id);

			if (element?.getElementsByTagName("input")[0].checked !== isChecked)
				element?.getElementsByTagName("input")[0]?.click();
		});
	};

	const getSearchCards = () => {
		if (cardsState.searchValue && cardsState.searchValue !== "") {
			const filteredCards = (cards as any).filter(
				(card: any) =>
					card.name
						.toUpperCase()
						.indexOf(cardsState.searchValue.toUpperCase()) !== -1
			);

			return filteredCards;
		} else {
			return cards;
		}
	};

	const isSelectedAll = () => {
		if (cards && (cards as any).length > 0) {
			return selectedCardsCount === (cards as any).length;
		}

		return false;
	};

	return (
		<Wrapper
			ref={wrapperRef}
			className={`${
				!active || (cards && !(cards as any).length) ? "hidden" : ""
			} relative`}
			style={{
				border: "1px solid" + CHAIN_COLORS[chainType],
				borderRadius: "1.1rem",
			}}
		>
			{/* <SubstractSVG className="substractSVG" fill={CHAIN_COLORS[chainType]} /> */}

			<Title
				style={{
					background: CHAIN_COLORS[chainType],
					color: chainType == CHAIN_TYPES["BNB-Testnet"] ? "black" : "white",
					overflow: "hidden",
				}}
				className="flex justify-center items-center font-bold gap-2"
			>
				<img
					alt="pic"
					// src={`/assets/icons/chain/${CHAIN_NAMES[chainType]}.svg`}
					src={`/img/icons/chain/${chainType}.svg`}
					style={{
						height: "25px",
						width: "25px",
						backgroundColor:
							chainType == CHAIN_TYPES["BNB-Testnet"] ? "black" : "white",
						padding: "2px",
						borderRadius: "1000px",
					}}
				/>
				{CHAIN_NAMES[chainType]}
			</Title>

			{/* {isMyWallet && (
        <CheckBox>
          <label
            className="m-checkbox__label"
            htmlFor={`selectAllInput${chainType}`}
          >
            Select All Batch Enabled ONFTs
          </label>
          <input
            type={"checkbox"}
            className="m-checkbox__input"
            id={`selectAllInput${chainType}`}
            onChange={onChangeSelectAll}
            checked={isSelectedAll()}
          />
        </CheckBox>
      )} */}

			<NFTWrapper className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-[75px]">
				{!cards
					? new Array(5)
							.fill(10)
							.map((card: any, index: number) => (
								<NFTCard key={`card${index}`} card={card} loading={true} />
							))
					: getSearchCards().map((card: any, index: number) => (
							<NFTCard
								key={`card${index}`}
								card={card}
								chainId={chainType}
								isMyWallet={isMyWallet}
								setShowOneModal={setShowOneModal}
								setSelectCard={setSelectCard}
								activeCollection={
									cardsState.selectedCards.length
										? cardsState.selectedCards[0].contract
										: ""
								}
							/>
					  ))}
			</NFTWrapper>

			{isMyWallet && (
				<>
					<TraverseBtn
						style={{
							position: isBottomVisible ? "absolute" : "sticky",
							left: isBottomVisible ? "50%" : "calc(50% + 8px)",
							backgroundColor: CHAIN_COLORS[chainType],
						}}
						className="z-30 bottom-4"
						onClick={() => setShowModal(true)}
						disabled={!selectedCardsCount}
					>
						Traverse from {CHAIN_NAMES[chainType]}
					</TraverseBtn>

					{showModal && (
						<TraverseModal
							active={showModal}
							onClose={() => setShowModal(false)}
							traversingCards={cardsState.selectedCards}
							nftCount={selectedCardsCount}
							chainId={chainType}
							setBlock={setBlock}
						/>
					)}

					{showOneModal && (
						<TraverseModal
							active={showOneModal}
							onClose={() => setShowOneModal(false)}
							traversingCards={selectCard}
							nftCount={1}
							chainId={chainType}
							setBlock={setBlock}
						/>
					)}
				</>
			)}
		</Wrapper>
	);
};

export default ChainNFT;

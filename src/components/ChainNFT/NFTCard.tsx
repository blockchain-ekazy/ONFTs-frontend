import styled, { keyframes } from "styled-components";
import { CheckBox } from ".";
import { getNavigableURL } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { addSelected, removeSelected } from "../../store/reducers/cards";
import { NotificationManager } from "react-notifications";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React from "react";
const loading = keyframes`
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }

    100% {
        opaicty: 1;
    }
`;

const Card = styled.div`
  box-shadow: 18px 17px 56px rgba(0, 0, 0, 0.25);
  border-radius: 9px;
  width: fit-content;
  padding: 1px;
  cursor: pointer;
  height: fit-content;
  @media screen and (max-width: 960px) {
    // transform: scale(0.8);
    transform-origin: top center;
  }

  @media screen and (max-width: 720px) {
    // transform: scale(0.5);
    // transform-origin: top center;
  }

  @media screen and (max-width: 435px) {
    // transform: scale(0.4);
    // transform-origin: top center;
  }

  @media screen and (max-width: 360px) {
    // transform: scale(0.35);
    // transform-origin: top center;
  }
  .cardLoad {
    animation: 2s ${loading} linear infinite;
  }

  .nftContent {
    height: 100%;
    background: #1e1e1e;
    border-radius: 9px;
  }

  // .cardImage {
  //   width: 170px;
  //   height: 170px;
  // }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(37, 53, 217, 1) 0%,
      rgba(255, 14, 100, 1) 100%
    );
  }
`;

const Loading = styled.div`
  background: linear-gradient(
    90deg,
    rgba(217, 217, 217, 0.21) 0%,
    rgba(255, 255, 255, 0.85) 81.54%,
    rgba(217, 217, 217, 0.22) 100%
  );
  opacity: 0.57;
  border-radius: 2px;
  height: 12px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: white;
`;

export const NFTCard = ({
  card,
  loading,
  chainId,
  isMyWallet,
  setShowOneModal,
  setSelectCard,
  activeCollection,
}: any) => {
  const cardsState = useSelector((state: any) => state.cards);
  const dispatch = useDispatch();

  const {
    contract_type: contractType,
    contractAddress: contract,
    tokenId: tokenId,
    version: version,
    addresses: addresses,
  } = card;

  // console.log(card);

  const name = !loading && card.name;
  const image = !loading && card.image;

  const getSelectedChainCards = () => {
    return cardsState.selectedCards.filter(
      (card: any) => card.chainId === chainId
    );
  };

  const isSelected =
    getSelectedChainCards().findIndex(
      (item: any) =>
        item.chainId === chainId &&
        item.contract === contract &&
        item.tokenId === tokenId
    ) !== -1;

  const onClickSelectCard = (ev: any) => {
    ev.stopPropagation();

    if (loading || !isMyWallet) return;

    const selectedCards = getSelectedChainCards();

    if (ev.target.checked) {
      if (selectedCards.length > 0 && selectedCards[0].contract !== contract) {
        if (selectedCards[0].contract !== contract)
          NotificationManager.warning(
            "You can only select ONFTs from the same collection"
          );
        return;
      }

      dispatch(
        addSelected({
          chainId,
          contract,
          tokenId,
          image,
          name,
          version,
          addresses,
        })
      );
    } else {
      dispatch(
        removeSelected({
          chainId,
          contract,
          tokenId,
        })
      );
    }
  };

  const onClickCard = () => {
    setSelectCard([
      {
        chainId,
        contract,
        tokenId,
        image,
        name,
        version,
        addresses,
      },
    ]);
    setShowOneModal((prev: boolean) => !prev);
  };

  return (
    <Card
      id={`chainNFT${chainId}${tokenId}${contract}`}
      className={`relative flex flex-col justify-center items-center`}
      onClick={() => onClickCard()}
    >
      <div className="nftContent p-4">
        {loading ? (
          <div className="cardLoad flex flex-col gap-4">
            <img alt="pic" src="/assets/imgs/nft_placeholder.png" />

            <Loading />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <img
                className="cardImage object-contain w-full h-[100px] md:h-[170px]"
                alt="pic"
                placeholder="/assets/imgs/nft_placeholder.png"
                src={getNavigableURL(image)}
              />

              <Title>{name}</Title>
            </div>

            {isMyWallet && (
              <div className="flex justify-end w-full">
                <CheckBox
                  style={{
                    position: "relative",
                    visibility:
                      version != 1 &&
                      (activeCollection == "" || activeCollection == contract)
                        ? "visible"
                        : "hidden",
                  }}
                  onClick={(ev: any) => ev.stopPropagation()}
                >
                  <input
                    id={`select${chainId + tokenId + contract}`}
                    type={"checkbox"}
                    className={`m-checkbox__input ${
                      // version !== 2 ? "opacity-30" : ""
                      ""
                    }`}
                    value={"on"}
                    checked={isSelected}
                    onChange={onClickSelectCard}
                  />
                </CheckBox>
              </div>
            )}
          </>
        )}
      </div>

      {/* {version !== 2 ? (
        <ReactTooltip
          anchorId={`select${chainId + tokenId + contract}`}
          place="bottom"
          variant="info"
          content="This ONFT's collection does not support batch traversing"
        />
      ) : null} */}
    </Card>
  );
};

export default NFTCard;

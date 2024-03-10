import styled from "styled-components";
import { NormalButton } from "../../theme/components";
import { ChainSelect } from "./chainSelect";
import { useState } from "react";
import {
  APIS_BASE_URL,
  CHAIN_COLORS,
  CHAIN_NAMES,
  CHAIN_TYPES,
  TRAVERSAL_CONTRACT,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { getNavigableURL, shortenAddress } from "../../utils/helper";
import { chainIdToInfo } from "../../utils/chainConfig";
import Web3 from "web3";
import ABI_ERC721 from "../../assets/abis/basicERC721.abi.json";
import traverbridge_abi from "../../assets/abis/traverse.bridge.abi.json";
import entrypointAbi from "../../assets/abis/entrypoint.abi.json";
import { switchNetwork } from "../../controllers/wallet";
import { Tooltip } from "@material-tailwind/react";
import { toast } from "react-toastify";

import { ethers } from "ethers";
import axios from "axios";
// import { contract } from "web3/lib/commonjs/eth.exports";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: all 0.3s;

  &.active {
    opacity: 1;
    pointer-events: auto;
    user-select: auto;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  z-index: 98;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
`;

const TraverseModalContent = styled.div`
  position: relative;
  padding: 2px;
  width: 1100px;
  max-width: 90%;
  background: linear-gradient(
    135deg,
    rgba(37, 53, 217, 1) 0%,
    rgba(255, 14, 100, 1) 100%
  );
  transform: translate3d(-50%, -50%, 0);
  left: 50%;
  top: 50%;
  z-index: 99;
  border-radius: 11px;
  box-shadow: inset -3px 4px 224px -26px rgba(0, 0, 0, 0.24);
`;

const ModalContainer = styled.div`
  overflow: auto;
  max-height: calc(90vh - 4px);

  background: #1e1e1e;
  border-radius: 11px;
  padding: 3rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;

  img {
    width: 21px;
    transition: all 0.3s;

    &:hover {
      filter: invert(0.5);
    }
  }
`;

const NFTInfoWrapper = styled.div`
  color: white;

  .bg-text {
    font-weight: 500;
    font-size: 28px;
    line-height: 28px;
  }

  .sm-text {
    font-weight: 500;
    font-size: 18px;
  }
`;

const NFTImage = styled.div`
  img {
    width: 300px;
    height: 300px;
  }
`;

const NFTTitle = styled.div`
  font-weight: 500;
  font-size: 40px;
`;

const ChainWrapper = styled.div`
  width: 800px;
  max-width: 90%;
  color: white;
`;

const ChainItem = styled.div`
  position: relative;
  z-index: 50;

  .bg-text {
    font-weight: 500;
    font-size: 28px;
    line-height: 35px;
  }

  .chainName {
    font-weight: 500;
    font-size: 18px;
    line-height: 23px;
  }

  .destChain {
    border: 2px solid #fffbf7;
    width: 111px;
    height: 111px;
    border-radius: 100vw;

    &.border-none {
      border: none;
    }
  }

  .chainPreviewImg {
    width: 111px;
    height: 111px;
  }
`;

const TraverseBtn = styled(NormalButton)`
  font-weight: 500;
  font-size: 28px;
  color: white;
  border-radius: 11px;
  padding: 1rem 1.25rem;
  background: rgb(37, 53, 217);
  margin-top: 70px;

  &:disabled {
    background: transparent;
    opacity: 0.3;
    border: 2px solid #fffbf7;
    color: white;
  }
`;

const ChainLine = styled.div`
  width: 0;
  left: 125px;
  top: 95px;
  position: absolute;
  height: 10px;
  background: white;
  z-index: 10;
  transition: width 0.5s;
  border-radius: 20px;

  &.active {
    width: calc(100% - 280px) !important;
  }
`;

const NFTSingle = ({ cards }: any) => {
  const card = cards[0];
  const [isTooltipDisabled, setIsTooltipDisabled] = useState(true);
  const [isoverDisabled, setIsoverDisabled] = useState(true);
  const onClickCopy = async () => {
    await navigator.clipboard.writeText(card.contract);
    setIsTooltipDisabled(true);
    setIsoverDisabled(false);
    setTimeout(() => {
      //setIsTooltipDisabled(false);
      setIsoverDisabled(true);
    }, 2000);
  };

  return (
    <NFTInfoWrapper className="flex items-center gap-8 relative mb-8">
      <NFTImage>
        <img
          alt="pic"
          placeholder="/assets/imgs/nft_placeholder.png"
          src={getNavigableURL(card.image)}
        />
      </NFTImage>

      <div
        className="flex flex-col gap-4"
        style={{ width: "calc(100% - 380px - 2rem)" }}
      >
        <NFTTitle>{card.name}</NFTTitle>

        <div className="flex flex-col">
          <div className="bg-text">Description</div>

          <div className="sm-text">{card.name}</div>
        </div>

        <div className="flex flex-col">
          <div className="bg-text">Source Contract</div>

          <div className="sm-text flex justify-start items-center gap-4">
            {shortenAddress(card.contract)}

            {/* click tooltip with time disabled*/}
            <Tooltip
              key={"tooltip-hover"}
              content="Copied"
              placement="bottom"
              open={!isoverDisabled}
            >
              {/* tooltip with hover   */}
              <Tooltip
                key={"tooltip-popup"}
                content="Copy address"
                placement="right"
                open={!isTooltipDisabled}
              >
                <img
                  alt="pic"
                  src="/assets/imgs/copy-icon.svg"
                  width={25}
                  height={25}
                  className="w-6 h-6 cursor-pointer hover:opacity-75"
                  onClick={onClickCopy}
                  onMouseEnter={() => setIsTooltipDisabled(false)}
                  onMouseLeave={() => setIsTooltipDisabled(true)}
                />
              </Tooltip>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="bg-text">NFT ID</div>

          <div className="sm-text">{card.tokenId}</div>
        </div>
      </div>
    </NFTInfoWrapper>
  );
};

const NFTImageGroup = styled.div`
  display: inline-flex;
  width: 60%;
  height: 295px;
  filter: drop-shadow(9px 7px 18px rgba(0, 0, 0, 0.3));

  .groupItem {
    position: absolute;
    top: 0;

    img {
      width: 295px;
    }
  }
`;

const NFTList = styled.div`
  width: 35%;
  height: 295px;
  border-radius: 8px;
  padding: 5px;
  background: linear-gradient(
    90deg,
    rgba(37, 53, 217, 1) 0%,
    rgba(255, 14, 100, 1) 100%
  );

  .nftListContainer {
    color: white;
    background: #1e1e1e;
    border-radius: 8px;
    font-weight: 500;
    font-size: 18px;
    overflow: auto;
  }
`;

const NFTLessTen = ({ nftCount, cards }: any) => {
  return (
    <div className="flex mb-8 justify-between">
      <NFTImageGroup className="relative">
        {cards.map((card: any, index: number) => (
          <div
            key={`nftgroup${index}`}
            className="groupItem"
            style={{
              left: `calc((100% - 295px) / ${nftCount - 1} * ${index})`,
            }}
          >
            <img alt="pic" src={getNavigableURL(card.image)} />
          </div>
        ))}
      </NFTImageGroup>

      <NFTList className="relative">
        <div className="nftListContainer w-full h-full p-4">
          {cards.map((card: any) => (
            <div key={`cardname${card.tokenId}`}>{card.name}</div>
          ))}
        </div>
      </NFTList>
    </div>
  );
};

const NFTGroupFrame = styled.div`
  position: relative;
  width: 45%;

  img {
    width: 100%;
  }

  .nftContents {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 3rem;
    padding-top: 4.5rem;
    padding-bottom: 1rem;
    padding-left: 2rem;

    .item {
      filter: drop-shadow(9px 7px 18px rgba(0, 0, 0, 0.3));

      img {
        width: 64px;
      }
    }

    .nftCount {
      font-weight: 500;
      font-size: 40px;
      color: white;
    }
  }
`;

const NFTMoreTen = ({ nftCount, cards }: any) => {
  return (
    <div className="flex mb-8 justify-around items-center">
      <NFTGroupFrame>
        <img alt="pic" src="/assets/imgs/nftGroupFrame.svg" />

        <div className="nftContents">
          <div className="flex gap-4 justify-center items-center flex-wrap">
            {cards.map((card: any) => (
              <div className="item" key={`imgGroup${card.tokenId}`}>
                <img alt="pic" src={getNavigableURL(card.image)} />
              </div>
            ))}
          </div>

          <div className="nftCount w-full text-center mt-4">
            {nftCount} NFTS
          </div>
        </div>
      </NFTGroupFrame>

      <NFTList className="relative">
        <div className="nftListContainer w-full h-full p-4">
          {cards.map((card: any) => (
            <div key={`cardname${card.tokenId}`}>{card.name}</div>
          ))}
        </div>
      </NFTList>
    </div>
  );
};

const TraversingContent = styled.div`
  width: 100%;
  height: 100%;
  color: white;
  font-size: 40px;
  font-weight: 500;

  img {
    width: 600px;
  }
`;

const TraversingState = {
  Before: 0x01,
  Traversing: 0x02,
  After: 0x03,
};

interface TraverseModalProps {
  active: boolean;
  onClose: VoidFunction;
  nftCount: number;
  chainId: string;
  setBlock: any;
  traversingCards: any;
}

export const TraverseModal = ({
  active,
  onClose,
  nftCount,
  chainId,
  setBlock,
  traversingCards,
}: TraverseModalProps) => {
  const getAvailableChains = () => {
    return traversingCards[0].addresses.contracts.map((a_: any) => {
      return a_.chainId;
    });
  };

  const dispatch = useDispatch();

  const walletState = useSelector((state: any) => state.wallet);

  const [selectedChain, setSelectedChain] = useState(null);

  const [isTraversing, setIsTraversing] = useState(TraversingState.Before);
  const [isSuccess, setIsSuccess] = useState(false);

  const getSelectedChainCards = () => {
    return traversingCards.filter((card: any) => card.chainId === chainId);
  };

  const onClickTraverse = async () => {
    if (!selectedChain) return;

    const selectedCards = getSelectedChainCards();
    const version = selectedCards[0].version; // remove

    if (version == 1) {
      traverseV1();
      return;
    } else if (version == 2) {
      traverseV2();
      return;
    }

    const destChainId = chainIdToInfo[selectedChain].lzChainId;
    const srcEntryPoint = chainIdToInfo[chainId].lzEntryPoint;
    const web3Instance = new Web3(walletState.provider);

    if (!selectedCards.length) return;

    if (walletState.connectedChainId !== chainId) {
      await switchNetwork(walletState.provider, chainId, dispatch);
    }

    // if (version == 1 && selectedCards.length > 1) {
    //   toast.error(
    //     "This collection does not support batch traverse. Please move one ONFT at a time!"
    //   );
    //   return;
    // }

    const contractAddress = selectedCards[0].contract;
    const destcontracts = selectedCards[0].addresses.contracts;

    setIsTraversing(TraversingState.Traversing);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();

    //approve
    try {
      const tokenContract: any = new ethers.Contract(
        contractAddress,
        ABI_ERC721,
        signer
      );
      if (
        !(await tokenContract.isApprovedForAll(
          walletState.address,
          TRAVERSAL_CONTRACT[chainId as keyof object]
        ))
      ) {
        let tx = await tokenContract.setApprovalForAll(
          TRAVERSAL_CONTRACT[chainId as keyof object],
          true
        );
        let req = await tx.wait();
      }
    } catch (e) {
      console.log(e);
      setIsTraversing(TraversingState.After);
      return;
    }
    //approve

    const payload = web3Instance.eth.abi.encodeParameters(
      ["address", "uint16[]", "address"],
      [
        contractAddress,
        selectedCards.map((card: any) => card.tokenId),
        walletState.address,
      ]
    );
    const adapterParams = web3Instance.utils.encodePacked(
      { value: 1, type: "uint16" },
      { value: 1000000, type: "uint256" }
    );

    const endpointInstance: any = new ethers.Contract(
      srcEntryPoint,
      entrypointAbi,
      signer
    );

    const crossGas = await endpointInstance.estimateFees(
      destChainId,
      contractAddress,
      payload,
      false,
      adapterParams
    );
    const additional_pay = (Number(crossGas[0]) / 100) * 3;

    //traverse
    try {
      const traverseContract: any = new ethers.Contract(
        TRAVERSAL_CONTRACT[chainId as keyof object],
        traverbridge_abi,
        signer
      );

      if (
        Number(await provider.getBalance(walletState.address)) <
        Math.round(Number(crossGas[0]) + additional_pay)
      ) {
        toast.error("Insufficient Funds for Traverse fees!");
        return;
      }

      let destAddress = destcontracts.find(
        (a_: any) => a_.chainId == selectedChain
      ).address;

      let sig = await axios.get(
        `${APIS_BASE_URL}/api/signtraverse/${contractAddress}/${chainId}/${selectedChain}`
      );

      console.log(
        ethers.utils.solidityPack(
          ["address", "address"],
          [
            "0x487D3bF65FDD36Ed4F5E7966a4ac7Ae70396f9C9",
            "0x281A8b2D88523c973dFe13217b09Ff193Ab4E9E2",
          ]
        )
      );

      let tx = await traverseContract.traverse(
        destChainId,
        contractAddress,
        destAddress,
        selectedCards.map((card: any) => card.tokenId),
        sig.data.signature1,
        { value: String(Math.round(Number(crossGas[0]) + additional_pay)) }
      );
      let req = await tx.wait();

      setIsSuccess(true);
      setBlock((prev: number) => prev + 1);
    } catch (e) {
      console.log(e);
      setIsTraversing(TraversingState.After);
    }
    //traverse
    setIsTraversing(TraversingState.After);
  };

  const traverseV1 = async () => {
    if (!selectedChain) return;

    const selectedCards = getSelectedChainCards();
    const version = selectedCards[0].version; // remove

    if (version != 1) {
      console.log("This function is only for V1 traverse");
      return;
    }
    if (selectedCards.length > 1) {
      toast.error(
        "This collection does not support batch traverse. Please move one ONFT at a time!"
      );
      return;
    }

    const destChainId = chainIdToInfo[selectedChain].lzChainId;
    const srcEntryPoint = chainIdToInfo[chainId].lzEntryPoint;
    const web3Instance = new Web3(walletState.provider);

    if (!selectedCards.length) return;

    if (walletState.connectedChainId !== chainId) {
      await switchNetwork(walletState.provider, chainId, dispatch);
    }

    const contractAddress = selectedCards[0].contract;
    const destcontracts = selectedCards[0].addresses;

    setIsTraversing(TraversingState.Traversing);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();

    const payload = web3Instance.eth.abi.encodeParameters(
      ["address", "uint"],
      [contractAddress, selectedCards[0].tokenId]
    );
    const adapterParams = web3Instance.utils.encodePacked(
      { value: 1, type: "uint16" },
      { value: 1000000, type: "uint256" }
    );

    const endpointInstance: any = new ethers.Contract(
      srcEntryPoint,
      entrypointAbi,
      signer
    );

    const crossGas = await endpointInstance.estimateFees(
      destChainId,
      contractAddress,
      payload,
      false,
      adapterParams
    );
    const additional_pay = Number(crossGas[0]) / 100;

    const bridgeContract: any = new ethers.Contract(
      TRAVERSAL_CONTRACT[chainId as keyof object],
      traverbridge_abi,
      signer
    );

    try {
      let tx = await bridgeContract.traverseV1({
        value: Math.round(additional_pay),
      });
      let req = await tx.wait();
    } catch (e) {
      console.log(e);
      setIsTraversing(TraversingState.After);
    }

    //traverse
    try {
      const traverseContract: any = new ethers.Contract(
        contractAddress,
        [
          {
            inputs: [
              { internalType: "uint16", name: "_chainId", type: "uint16" },
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "traverseChains",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        signer
      );

      if (
        Number(await provider.getBalance(walletState.address)) <
        Math.round(Number(crossGas[0]) + additional_pay)
      ) {
        toast.error("Insufficient Funds for Traverse fees!");
        return;
      }

      let tx = await traverseContract.traverseChains(
        destChainId,
        selectedCards[0].tokenId,
        { value: String(Math.round(Number(crossGas[0]) + additional_pay)) }
      );
      let req = await tx.wait();

      setIsSuccess(true);
      setBlock((prev: number) => prev + 1);
    } catch (e) {
      console.log(e);
      setIsTraversing(TraversingState.After);
    }
    //traverse
    setIsTraversing(TraversingState.After);
  };

  const traverseV2 = async () => {
    if (!selectedChain) return;

    const selectedCards = getSelectedChainCards();
    const version = selectedCards[0].version; // remove

    if (version != 2) {
      console.log("Only for v2");
      return;
    }

    const destChainId = chainIdToInfo[selectedChain].lzChainId;
    const srcEntryPoint = chainIdToInfo[chainId].lzEntryPoint;
    const web3Instance = new Web3(walletState.provider);

    if (!selectedCards.length) return;

    if (walletState.connectedChainId !== chainId) {
      await switchNetwork(walletState.provider, chainId, dispatch);
    }

    // if (selectedCards.length > 1) {
    //   toast.error(
    //     "This collection does not support batch traverse. Please move one ONFT at a time!"
    //   );
    //   return;
    // }

    const contractAddress = selectedCards[0].contract;
    const destcontracts = selectedCards[0].addresses;

    setIsTraversing(TraversingState.Traversing);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();

    //approve
    try {
      const tokenContract: any = new ethers.Contract(
        contractAddress,
        ABI_ERC721,
        signer
      );

      if (
        !(await tokenContract.isApprovedForAll(
          walletState.address,
          TRAVERSAL_CONTRACT[chainId as keyof object]
        ))
      ) {
        let tx = await tokenContract.setApprovalForAll(
          TRAVERSAL_CONTRACT[chainId as keyof object],
          true
        );
        let req = await tx.wait();
      }
    } catch (e) {
      console.log(e);
      setIsTraversing(TraversingState.After);
      return;
    }
    //approve

    const payload = web3Instance.eth.abi.encodeParameters(
      ["address", "uint16[]"],
      [contractAddress, selectedCards.map((card: any) => card.tokenId)]
    );
    const adapterParams = web3Instance.utils.encodePacked(
      { value: 1, type: "uint16" },
      { value: 1000000, type: "uint256" }
    );

    const endpointInstance: any = new ethers.Contract(
      srcEntryPoint,
      entrypointAbi,
      signer
    );

    const crossGas = await endpointInstance.estimateFees(
      destChainId,
      contractAddress,
      payload,
      false,
      adapterParams
    );
    const additional_pay = (Number(crossGas[0]) / 100) * 3;

    //traverse
    try {
      const traverseContract: any = new ethers.Contract(
        TRAVERSAL_CONTRACT[chainId as keyof object],
        traverbridge_abi,
        signer
      );

      if (
        Number(await provider.getBalance(walletState.address)) <
        Math.round(Number(crossGas[0]) + additional_pay)
      ) {
        toast.error("Insufficient Funds for Traverse fees!");
        return;
      }

      let tx;

      if (selectedCards.length == 1)
        tx = await traverseContract.traverseV2(
          walletState.address,
          destChainId,
          walletState.address,
          selectedCards[0].tokenId,
          walletState.address,
          "0x0000000000000000000000000000000000000000",
          adapterParams,
          contractAddress,
          { value: String(Math.round(Number(crossGas[0]) + additional_pay)) }
        );
      else
        tx = await traverseContract.traverseV2Batch(
          walletState.address,
          destChainId,
          walletState.address,
          selectedCards.map((card: any) => card.tokenId),
          walletState.address,
          "0x0000000000000000000000000000000000000000",
          adapterParams,
          contractAddress,
          { value: String(Math.round(Number(crossGas[0]) + additional_pay)) }
        );
      let req = await tx.wait();

      setIsSuccess(true);
      setBlock((prev: number) => prev + 1);
    } catch (e) {
      console.log(e);
      setIsTraversing(TraversingState.After);
    }
    //traverse
    setIsTraversing(TraversingState.After);
  };

  return (
    <ModalWrapper className={`${active ? "active" : ""}`}>
      <DialogOverlay onClick={onClose} />

      <TraverseModalContent className="relative">
        <ModalContainer className="w-full h-full">
          <CloseBtn onClick={onClose}>
            <img alt="pic" src="/assets/icons/close.svg" />
          </CloseBtn>

          {isTraversing === TraversingState.Before ? (
            <>
              {nftCount === 1 ? (
                <NFTSingle cards={getSelectedChainCards()} />
              ) : nftCount <= 10 ? (
                <NFTLessTen
                  nftCount={nftCount}
                  cards={getSelectedChainCards()}
                />
              ) : (
                <NFTMoreTen
                  nftCount={nftCount}
                  cards={getSelectedChainCards()}
                />
              )}

              <ChainWrapper className="relative flex justify-between m-auto">
                <ChainItem className="flex flex-col justify-start items-center gap-2">
                  <div className="bg-text">Source Chain</div>

                  <img
                    className="chainPreviewImg"
                    alt="pic"
                    // src={`/assets/imgs/chain/${CHAIN_NAMES[chainId]}.png`}
                    src={`/img/icons/chain/${chainId}.svg`}
                  />

                  <div className="chainName">{CHAIN_NAMES[chainId]}</div>
                </ChainItem>

                <ChainItem className="flex flex-col justify-start items-center gap-2">
                  <div className="bg-text">Destination Chain</div>

                  <div
                    className={`destChain ${
                      selectedChain ? "border-none" : ""
                    }`}
                  >
                    {selectedChain && (
                      // <img
                      //   className="rounded-full"
                      //   alt="pic"
                      //   // src={`/assets/imgs/chain/${CHAIN_NAMES[selectedChain]}.png`}
                      // />

                      <img
                        className="chainPreviewImg"
                        alt="pic"
                        // src={`/assets/imgs/chain/${CHAIN_NAMES[chainId]}.png`}
                        src={`/img/icons/chain/${selectedChain}.svg`}
                      />
                    )}
                  </div>

                  <ChainSelect
                    selectedChain={selectedChain}
                    setSelectedChain={setSelectedChain}
                    chainId={chainId}
                    availableChains={getAvailableChains()}
                  />
                </ChainItem>

                <ChainLine
                  id={"chainLine"}
                  className={`${selectedChain ? "active" : ""}`}
                  style={{
                    background: `linear-gradient(
                                90deg,
                                ${CHAIN_COLORS[CHAIN_TYPES["Mumbai"]]} 0%,
                                ${
                                  selectedChain
                                    ? CHAIN_COLORS[selectedChain]
                                    : "#fff"
                                } 100%
                            )`,
                  }}
                />
              </ChainWrapper>

              <div className="relative w-full flex justify-center items-center">
                <TraverseBtn
                  disabled={!selectedChain}
                  onClick={onClickTraverse}
                >
                  Traverse
                </TraverseBtn>
              </div>
            </>
          ) : isTraversing === TraversingState.Traversing ? (
            <TraversingContent className="flex flex-col justify-center items-center gap-8">
              <img src="/assets/imgs/traversing.gif" alt="pic" />
              Traversing...
            </TraversingContent>
          ) : isTraversing === TraversingState.After ? (
            <TraversingContent className="flex flex-col justify-center items-center gap-8">
              <img src="/assets/imgs/afterTraversing.png" alt="pic" />
              {isSuccess
                ? "It may take a few minutes for your ONFT to arrive at its destination chain!"
                : "Something went wrong!"}
            </TraversingContent>
          ) : null}
        </ModalContainer>
      </TraverseModalContent>
    </ModalWrapper>
  );
};

export default TraverseModal;

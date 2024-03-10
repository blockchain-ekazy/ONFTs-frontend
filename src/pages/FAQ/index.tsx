import styled from "styled-components";
import NavBar from "../../components/NavBar";
import { APIS_BASE_URL, CHAIN_NAMES, CHAIN_TO_LZ } from "../../constants";
import { Footer } from "../../components/Footer";
import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Radio,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import Web3 from "web3";

import {
  EReCaptchaV2Size,
  EReCaptchaV2Theme,
  ReCaptchaProvider,
  ReCaptchaV2,
  ReCaptchaV3,
} from "recaptcha-v2v3";

const Wrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 104px);
  margin-top:20px;

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
  font-family: Futura;
  font-weight: 500;
`;

const HeaderText = styled.div`
  color: #fff;
  font-size: 18px;
  font-family: Futura;
  font-weight: 500;
`;

export const FAQ = () => {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Wrapper className="relative w-screen">
        <NavBar />

        <Space />
        <div className="container m-auto">
          <ContentWrapper>
            <div
              className="relative m-auto flex flex-col gap-5"
              style={{ width: "90%" }}
            >
              <HeaderTitle>Frequently Asked Questions (FAQ)</HeaderTitle>

              <h3 className="text-white font-[600] text-[24px]">
                General Questions
              </h3>

              <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  What is this site for?
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  Our site is designed to allow users to traverse their
                  Omnichain NFTs (ONFTs) from one blockchain to another using
                  LayerZero's messaging protocol. This opens up a world of
                  possibilities, such as accessing different marketplaces,
                  services, or utilities that might be available on other
                  blockchains.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(2)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  What is an ONFT?
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  ONFT stands for Omnichain NFT (Non-Fungible Token). Unlike
                  traditional NFTs that exist solely on a specific blockchain,
                  ONFTs are designed to be interoperable and can be transferred
                  or used across multiple blockchain networks.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(3)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  How does it work?
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  <ul className="flex flex-col gap-2">
                    <li>
                      <b className="font-extrabold">Select the ONFT:</b> Choose
                      the ONFT you wish to traverse to another chain.
                    </li>
                    <li>
                      <b className="font-extrabold">
                        Choose Destination Chain:
                      </b>{" "}
                      Select the blockchain network you want your ONFT to move
                      to.
                    </li>
                    <li>
                      <b className="font-extrabold">Confirm Transfer:</b> Review
                      the details and proceed to confirm the transfer on your
                      digital wallet.
                    </li>
                    <li>
                      <b className="font-extrabold">Wait for Confirmation:</b>{" "}
                      The transaction goes through our LayerZero messaging
                      protocol. Once verified, the ONFT appears on the
                      destination chain.
                    </li>
                  </ul>
                </AccordionBody>
              </Accordion>

              <h3 className="text-white font-[600] text-[24px]">
                Transfer and Technical Issues
              </h3>

              <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(4)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  Why can't I batch transfer these ONFTs?
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  Currently, our platform supports the transfer of individual
                  ONFTs as well as batch transfer of ONFT’s, but the ability of
                  an ONFT to batch transfer is based on that specific ONFT’s
                  contract. If you can see your ONFTs but cannot batch transfer,
                  ability was not written into the contract code :
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(5)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  Explanation of the "Scary Wallet Give Access to Everything"
                  warning
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  When you initiate a transfer, your digital wallet might prompt
                  you with a warning message asking for permission to "give
                  access to everything." This warning is a standard security
                  measure. While it might seem alarming, it's essential to
                  understand that the permission is necessary for the ONFT
                  traversal to take place. We do not have control over your
                  wallet or assets. The permission is solely for the execution
                  of the selected operation.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 6} icon={<Icon id={6} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(6)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  What do I do if I don't see my collection?
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  If your ONFT collection isn't listed on our platform, 
                  it means that it hasn't been integrated yet. 
                  You can request to <a href="/request" className="text-red-700 cursor-pointer">add your collection</a> and fill out the necessary information. 
                  Our team will review your application, and if approved, 
                  your collection will be added to the platform for traversal
                </AccordionBody>
              </Accordion>

              <h3 className="text-white font-[600] text-[24px]">
                Support and Miscellaneous
              </h3>

              <Accordion open={open === 7} icon={<Icon id={7} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(7)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  How do I get support if I encounter an issue?
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  You can reach out to us at{" "}
                  <a
                    href="mailto:support@traversemyonft.com"
                    className="font-[900]"
                  >
                    support@traversemyonft.com
                  </a>{" "}
                  for any assistance.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 8} icon={<Icon id={8} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(8)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  Are there any fees involved?
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  Yes, there is a nominal fee associated (~1% of destination
                  gas) with each traversal to cover the transaction costs and to
                  maintain the platform. The fee amount is displayed before you
                  confirm the transfer.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 9} icon={<Icon id={9} open={open} />}>
                <AccordionHeader
                  onClick={() => handleOpen(9)}
                  className="text-[14px] font-bold !text-white py-[13px] px-[16px] border-white border-[1px] rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.10) 100%)",
                    fontFamily: "TT_Chocolates",
                  }}
                >
                  Is it secure?
                </AccordionHeader>
                <AccordionBody className="py-[13px] px-[16px] text-[14px] !text-white">
                  Yes, the security of your assets is our top priority. Our use
                  of LayerZero's protocol ensures a secure and reliable
                  traversal process. However, like any blockchain-related
                  activity, always exercise caution and double-check all details
                  before confirming any transactions.
                </AccordionBody>
              </Accordion>

              <p className="py-[13px] px-[16px] text-[14px] !text-white text-center">
                For more queries, you can contact us at{" "}
                <a
                  href="mailto:support@traversemyonft.com"
                  className="font-[900]"
                >
                  support@traversemyonft.com
                </a>
                . We're here to help!
              </p>
            </div>
          </ContentWrapper>
        </div>
        <Space />
      </Wrapper>
      <Footer />
    </>
  );
};

export default FAQ;

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

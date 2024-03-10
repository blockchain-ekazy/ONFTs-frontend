import styled from "styled-components";
import NavBar from "../../components/NavBar";
import { APIS_BASE_URL, CHAIN_NAMES, CHAIN_TO_LZ } from "../../constants";
import { Footer } from "../../components/Footer";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
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
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

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
  font-size: 17px;
  font-family: TT_Chocolates;
  font-weight: 100;
`;

const SubHeading = styled.div`
  color: #fff;
  font-size: 28px;
  font-family: TT_Chocolates;
  font-weight: 500;
`;

export const Request = () => {
  const [data, setData] = useState({});
  const [token, setToken] = useState("");
  const [contracts, setContracts] = useState([]);
  const [availableChains, setAvailableChains] = useState([]);
  const [type, setType] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getChainOptions();
  }, []);

  function addChain() {
    getChainOptions();

    let c_: any = [...contracts];

    c_.push({
      chainId: "",
      lzChainId: "",
      address: "",
    });

    setContracts(c_);
  }

  function removeChain(index: any) {
    getChainOptions();

    let c = [...contracts];
    c.splice(index, 1);

    setContracts(c);
  }

  function selectChain(chainId: any, index: any) {
    let c_: any = [...contracts];

    c_[index].chainId = chainId;
    c_[index].lzChainId = CHAIN_TO_LZ[chainId as keyof object];

    setContracts(c_);
  }

  function setChainAddress(address: any, index: any) {
    let c_: any = [...contracts];
    c_[index].address = address;
    setContracts(c_);
  }

  function getChainOptions() {
    let chains: any = [];
    Object.keys(CHAIN_NAMES).forEach((chainId) => {
      chains.push({
        id: chainId,
        name: CHAIN_NAMES[chainId],
        lzId: CHAIN_TO_LZ[chainId as keyof object],
      });
    });

    setAvailableChains(chains);
  }

  function isChainAlreadySelected(chainId: any) {
    let cts = [...contracts];

    let found = false;
    cts.forEach((c: any) => {
      if (c.chainId == chainId) found = true;
    });

    return found;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!token) {
      toast.error("Solve Captcha");
      return;
    }

    let _data = {
      ...data,
      contracts: [...contracts],
      approved: false,
      reCAPTCHA_TOKEN: token,
      version: type,
    };

    let isvalid = true;
    _data.contracts.forEach((c_: any) => {
      if (!Web3.utils.isAddress(c_.address)) {
        isvalid = false;
      }
    });
    if (!isvalid) {
      toast.error("Invalid Address");
      return;
    }
    await axios
      .post(`${APIS_BASE_URL}/api/request`, _data, {})
      .then((res: any) => {
        toast.success("Request Success");
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data);
      });
  }

  function onChange(value: any) {
    setToken(value);
  }

  return (
		<>
			<Wrapper className="relative w-screen !bg-contain !bg-top !bg-no-repeat">
				<NavBar />

				<Space />
				<div
					className="container-fluid m-auto md:pt-[100px] pb-[0px] !bg-cover !bg-no-repeat"
					style={{ background: 'url("/assets/imgs/stars.png")' }}
				>
					<div className="container mx-auto">
						<ContentWrapper>
							<div className="relative m-auto grid md:grid-cols-2">
								<div>
									<HeaderTitle>Add Your Own Collection</HeaderTitle>
									<HeaderText className="my-2">
										We're thrilled that you're considering adding your own ONFT
										(Off-Chain NFT) collection to our platform! Our site
										utilizes LayerZero's messaging protocol to enable seamless
										traversing of ONFTs across various blockchain networks. If
										you're an ONFT collection deployer, you can integrate your
										collection with our platform, thereby offering your
										community the unique ability to traverse their ONFTs across
										multiple chains effortlessly.
									</HeaderText>
								</div>
							</div>
						</ContentWrapper>
					</div>
				</div>
				<img src="/assets/imgs/requesthero.png" className="w-full -mt-[10%]" />

				<div
					className="pb-[100px]"
					style={{
						background:
							"linear-gradient(180deg, #FD0F66 18.95%, #2535D9 183.09%)",
					}}
				>
					<HeaderTitle className="text-center mb-[50px]">Benefits</HeaderTitle>

					<div className="container mx-auto">
						<ContentWrapper>
							<div className=" grid md:grid-cols-3 gap-[80px]">
								<div className="bg-[#1e1e1e] py-[40px] px-[30px] rounded-xl border-[1px] border-[#FF0E64] shadow-2xl">
									<img
										className="w-[70px] h-[50px] object-contain mx-auto"
										src="/assets/imgs/Flexibility.png"
									/>
									<SubHeading className="my-3 text-center">
										Flexibility
									</SubHeading>
									<HeaderText className="my-2 text-center">
										Allow ONFT holders more choices in how they use and transfer
										their assets.
									</HeaderText>
								</div>
								<div className="bg-[#1e1e1e] py-[40px] px-[30px] rounded-xl border-[1px] border-[#FF0E64] shadow-2xl">
									<img
										className="w-[70px] h-[50px] object-contain mx-auto"
										src="/assets/imgs/Wider Exposure.png"
									/>
									<SubHeading className="my-3 text-center">
										Wider Exposure
									</SubHeading>
									<HeaderText className="my-2 text-center">
										Introduce your collection to a broader audience by making it
										interoperable across multiple blockchains.
									</HeaderText>
								</div>
								<div className="bg-[#1e1e1e] py-[40px] px-[30px] rounded-xl border-[1px] border-[#FF0E64] shadow-2xl">
									<img
										className="w-[70px] h-[50px] object-contain mx-auto"
										src="/assets/imgs/Innovation.png"
									/>
									<SubHeading className="my-3 text-center">
										Innovation
									</SubHeading>
									<HeaderText className="my-2 text-center">
										Be part of a pioneering ecosystem that's shaping the future
										of digital assets.
									</HeaderText>
								</div>
							</div>
						</ContentWrapper>
					</div>
				</div>

				<div className="container m-auto pt-[50px] md:py-[100px]">
					<ContentWrapper className="border-[#2535D9] border-[2px] rounded-xl shadow-2xl">
						<form
							className="p-[10px] md:p-[50px]"
							onSubmit={(e) => handleSubmit(e)}
						>
							<HeaderTitle className="text-center mb-[30px]">
								Add Your Collection
							</HeaderTitle>

							<h3 className="text-white font-[600] text-[16px] mt-10">
								Basic Information
							</h3>
							<div className="grid grid-cols-2 gap-4 mt-3 mb-10">
								<Input
									type="text"
									color="white"
									label="Collection Name"
									size="lg"
									value={data["title" as keyof object]}
									required
									onChange={(e) => setData({ ...data, title: e.target.value })}
								/>
								<Input
									label="Contact Email"
									color="white"
									size="lg"
									value={data["contact_email" as keyof object]}
									required
									type="email"
									onChange={(e) =>
										setData({ ...data, contact_email: e.target.value })
									}
								/>
								<div className="!col-span-2 w-full">
									<Input
										label="Website URL"
										color="white"
										size="lg"
										value={data["website_url" as keyof object]}
										required
										onChange={(e) =>
											setData({ ...data, website_url: e.target.value })
										}
									/>
								</div>
							</div>

							<div>
								<h3 className="text-white mb-3 font-[600] text-[16px] ">
									Technical Information
								</h3>
								<Select
									label="Select Type"
									size="lg"
									value={type}
									onChange={(e: any) => setType(e)}
									defaultValue={"0"}
									aria-required
								>
									<Option value={"0"} key={0} color="white">
										New drop, contracts not deployed
									</Option>
									<Option value={"1"} key={1} color="white">
										Already deployed with LayerZero v1 libraries
									</Option>
									<Option value={"2"} key={2} color="white">
										Already deployed with LayerZero v2 libraries
									</Option>
								</Select>
							</div>

							{(type == 1 || type == 2) && (
								<div>
									<div className="flex justify-between items-center mt-10">
										<Typography
											variant="small"
											className="text-[11px] font-bold uppercase text-blue-gray-400"
										>
											Supported Chains
										</Typography>
										<button
											onClick={() => addChain()}
											className="rounded-lg bg-[#2535D9] py-2 px-5 text-sm ml-auto font-bold text-white"
											type="button"
										>
											Add Chain
										</button>
									</div>
									{contracts.map((c: any, i) => {
										return (
											<div
												className="grid grid-cols-12 items-center gap-2 my-5"
												key={i}
											>
												<div className="md:col-span-3 col-span-12">
													<Select
														label="Select Chain"
														size="lg"
														value={c.chainId}
														onChange={(e) => selectChain(e, i)}
													>
														{availableChains.map((chain: any) => {
															return (
																<Option
																	value={chain.id}
																	disabled={isChainAlreadySelected(chain.id)}
																	key={chain.id}
																	color="white"
																>
																	<img
																		src={`/img/icons/chain/${chain.id}.svg`}
																		className="mr-2 inline-block h-[20px] w-[20px]"
																	/>
																	{chain.name}
																</Option>
															);
														})}
													</Select>
												</div>
												<div className="md:col-span-8 col-span-10">
													<Input
														type="text"
														label="Contract Address"
														size="lg"
														color="white"
														required
														value={c.address}
														onChange={(e) => setChainAddress(e.target.value, i)}
													/>
												</div>
												<div className="col-span-1 text-right">
													<button
														onClick={() => removeChain(i)}
														className="rounded-lg bg-[#2535D9] py-2 px-5 text-md m-auto font-bold text-white"
													>
														X
													</button>
												</div>
											</div>
										);
									})}
								</div>
							)}

							<h3 className="text-white font-[600] text-[16px] mt-[50px]">
								Links to community platforms
							</h3>

							<div className="mt-3 grid gap-4">
								<Input
									label="Discord"
									color="white"
									size="lg"
									value={data["discord" as keyof object]}
									type="discord"
									onChange={(e) =>
										setData({ ...data, discord: e.target.value })
									}
								/>
								<Input
									label="Telegram"
									color="white"
									size="lg"
									value={data["telegram" as keyof object]}
									type="telegram"
									onChange={(e) =>
										setData({ ...data, telegram: e.target.value })
									}
								/>
								<Input
									label="Other"
									color="white"
									size="lg"
									value={data["other" as keyof object]}
									type="other"
									onChange={(e) => setData({ ...data, other: e.target.value })}
								/>
							</div>

							<label>
								<h3 className="text-white font-[600] text-[16px] mt-10">
									Any other information:
								</h3>

								<textarea
									value={data["comments" as keyof object]}
									onChange={(e) =>
										setData({ ...data, comments: e.target.value })
									}
									className="bg-transparent w-full text-white border-[1px] rounded mt-3 p-2"
								></textarea>
							</label>

							<div className="my-10">
								<ReCaptchaProvider
									siteKeyV2="6LcLVesnAAAAAONbrsDQst5iYU9we3p16d9aJK-k"
									langCode="en"
									hideV3Badge={false}
								>
									<ReCaptchaV2
										callback={onChange}
										theme={EReCaptchaV2Theme.Light}
										size={EReCaptchaV2Size.Normal}
										id="my-id"
										data-test-id="my-test-id"
										tabindex={0}
									/>
								</ReCaptchaProvider>
							</div>

							<div className="text-center">
								<h6 className="text-white font-[400] text-[14px] mt-1 mb-3">
									Any other information that you think is pertinent for the
									integration. Once you've gathered all the necessary
									information, click the "Submit" button below. Our team will
									review your application and, if approved, begin the process of
									integrating your ONFT collection into our platform.
								</h6>
								<button className="rounded-lg bg-[#2535D9] py-3 px-6 text-lg m-auto font-bold text-white">
									Submit Your Collection
								</button>
							</div>
						</form>
					</ContentWrapper>

					<ContentWrapper>
						<h6 className="text-white font-[400] text-[14px] my-10 max-w-[800px] text-center m-auto">
							Note: Adding a new collection is subject to review for
							compatibility, security, and community guidelines. We reserve the
							right to decline any application that does not meet our criteria.
							<br />
							<br />
							For any questions or additional information, please reach out to
							us at{" "}
							<a
								href="
                support@traversemyonft.com
                "
								className="font-extrabold"
							>
								support@traversemyonft.com
							</a>
						</h6>
					</ContentWrapper>
				</div>
			</Wrapper>
			<Footer />
		</>
	);
};

export default Request;

import styled from "styled-components";
import { CheckBox } from "../ChainNFT";
import { NormalButton } from "../../theme/components";
import React, { useState } from "react";
import { CHAIN_NAMES, CHAIN_TYPES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilteredChains,
  removeFilteredChains,
  setSearchValue,
} from "../../store/reducers/cards";

import {
  Menu,
  MenuHandler,
  Button,
  MenuList,
  MenuItem,
  Checkbox,
  MenuProps,
  MenuListProps,
} from "@material-tailwind/react";

const ToolBarWrapper = styled.div`
  margin-top: 4rem;
  //   margin-bottom: 1.5rem;
  //   margin-left: 13%;
`;

const SearchInput = styled.div`
  height: 3rem;
  background: #1e1e1e;
  border: 1px solid #fffbf7;
  box-shadow: 0px 4px 22px -6px rgba(0, 0, 0, 0.38);
  border-radius: 31px;
  width: 100%;

  @media (max-width: 700px) {
    // left: -2.5rem;
  }

  //   left: -4rem;
  input {
    color: #fffbf7;
    outline: none;
    width: 100%;
    padding-left: 50px;
    padding-right: 1.5rem;
    font-size: 18px;
    background: transparent;
  }
`;

const SearchIcon = styled.img`
  position: absolute;
  transform: translate(0, -50%);
  top: 50%;
  left: 1rem;
`;

const Setting = styled.div`
  cursor: pointer;

  .settingBtn {
    height: 44px;
    background: #1e1e1e;
    border: 1px solid #fffbf7;
    box-shadow: 0px 4px 22px -6px rgba(0, 0, 0, 0.38);
    border-radius: 31px;
    transition: all 0.5s;

    &.active {
      background: #fffbf7;
      img {
        filter: invert(1);
      }
    }
  }
`;

const HoverWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 257px;
  height: 203px;
  background: url("/assets/imgs/settingPop.svg");
  background-size: cover;
  transition: opacity 0.5s;
  opacity: 0;
  pointer-events: none;
  overflow: auto;

  &.active {
    opacity: 1;
    pointer-events: auto;
  }
`;

const FilterBtn = styled(NormalButton)`
  border-radius: 7px;
  border: 1px solid rgba(255, 251, 247, 1);
  color: rgba(255, 251, 247, 1);
  background: transparent;

  &:hover {
    background: #dadada;
  }

  &:disabled {
    border: 1px solid rgba(255, 251, 247, 0.2);
    color: rgba(255, 251, 247, 0.2);
    background: transparent;
  }
`;

export const ToolBar = ({ block, setBlock }) => {
  const cardsState = useSelector((state: any) => state.cards);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleMenuOpen = () => {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      setMenuOpen(true);
    }
  };

  const [showSetting, setShowSetting] = useState(false);

  const onSearch = (ev: any) => {
    dispatch(setSearchValue(ev.target.value));
  };

  const isFilteredChain = (chainId: any) => {
    const index = cardsState.filteredChains.indexOf(chainId);

    return index !== -1;
  };

  const onChangeCheckBox = (ev: any, chainId: any) => {
    const checked = ev.target.checked;

    if (checked) dispatch(addFilteredChains(chainId));
    else dispatch(removeFilteredChains(chainId));
  };

  return (
    <ToolBarWrapper className="flex gap-2 items-center md:w-[90%] m-auto">
      <SearchInput className="relative flex items-center col-span-8">
        <SearchIcon alt="pic" src="/assets/imgs/search_white.svg" />

        <input
          type="text"
          placeholder="Search"
          onChange={onSearch}
          value={cardsState.searchValue}
        />
      </SearchInput>
      <div className="col-span-2 text-center">
        <Button
          className={`w-[40px] h-[40px] p-0 border border-white bg-black settingBtn ${
            showSetting ? "active" : ""
          }`}
          onClick={() => setBlock(block + 1)}
        >
          <img
            alt="pic"
            src="/assets/imgs/reload.svg"
            className="w-[36px] h-[20px]"
          />
        </Button>
      </div>
      <div className="col-span-2 text-center">
        <Menu open={menuOpen} handler={handleMenuOpen}>
          <MenuHandler>
            <Button
              className={`w-[40px] h-[40px] p-[5px] border border-white bg-black settingBtn  ${
                showSetting ? "active" : ""
              }`}
              onClick={() => setShowSetting((prev) => !prev)}
            >
              <img
                alt="pic"
                src="/assets/imgs/setting.svg"
                className="w-[36px] h-[20px]"
              />
            </Button>
          </MenuHandler>
          <div onClick={(e) => e.stopPropagation()}>
            <MenuList
              onClick={(e) => e.stopPropagation()}
              className={`bg-black ${showSetting ? "active" : ""}`}
            >
              {Object.keys(CHAIN_TYPES).map((key: string, index: number) => (
                <div
                  key={`checkbox${index}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CheckBox
                    onClick={(e) => e.stopPropagation()}
                    key={`checkbox${index}`}
                    style={{ position: "relative" }}
                  >
                    <input
                      onClick={(e) => e.stopPropagation()}
                      type={"checkbox"}
                      className="m-checkbox__input"
                      id={`selectAllInput${index}`}
                      value={"on"}
                      checked={isFilteredChain(
                        CHAIN_TYPES[key as keyof typeof CHAIN_TYPES]
                      )}
                      onChange={(ev) =>
                        onChangeCheckBox(
                          ev,
                          CHAIN_TYPES[key as keyof typeof CHAIN_TYPES]
                        )
                      }
                    />
                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="m-checkbox__label"
                      htmlFor={`selectAllInput${index}`}
                    >
                      {
                        CHAIN_NAMES[
                          CHAIN_TYPES[key as keyof typeof CHAIN_TYPES]
                        ]
                      }
                    </label>
                  </CheckBox>
                </div>
              ))}
            </MenuList>
          </div>
        </Menu>
      </div>
    </ToolBarWrapper>
  );
};

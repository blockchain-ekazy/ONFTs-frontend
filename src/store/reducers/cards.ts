/** @format */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCards: [],
  cardsArray: [],
  searchValue: "",
  filteredChains: [],
} as any;

export const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addSelected: (state, action) => {
      state.selectedCards.push({
        chainId: action.payload.chainId,
        contract: action.payload.contract,
        tokenId: action.payload.tokenId,
        image: action.payload.image,
        name: action.payload.name,
        version: action.payload.version,
        addresses: action.payload.addresses,
      });
    },
    removeSelected: (state, action) => {
      const index = state.selectedCards.findIndex(
        (card: any) =>
          card.chainId === action.payload.chainId &&
          card.contract === action.payload.contract &&
          card.tokenId === action.payload.tokenId
      );

      if (index !== -1) state.selectedCards.splice(index, 1);
    },

    selectAll: (state, action) => {
      const cards = state.cardsArray.filter(
        (item: any) => item.chainId === action.payload
      );

      if (
        state.selectedCards.length > 0 &&
        state.selectedCards[0].chainId === action.payload &&
        state.selectedCards.length === cards.length
      ) {
        state.selectedCards = [];
      } else {
        state.selectedCards = cards.map((item: any) => {
          return {
            chainId: item.chainId,
            contract: item.info.contractAddress,
            tokenId: item.info.tokenId,
            image: item.info.metadata.image,
            name: item.info.metadata.name,
          };
        });
      }
    },

    setCardsArray: (state, action) => {
      state.cardsArray = action.payload;
    },

    insertCardsArray: (state, action) => {
      // const index = state.cardsArray.findIndex(
      //   (card: any) =>
      //     card.chainId == action.payload.chainId &&
      //     card.info.contractAddress === action.payload.info.contractAddress &&
      //     card.info.tokenId === action.payload.info.tokenId
      // );

      // if (index === -1)
      state.cardsArray.push(action.payload);
    },

    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },

    addFilteredChains: (state, action) => {
      const index = state.filteredChains.indexOf(action.payload);

      if (index === -1) state.filteredChains.push(action.payload);
    },
    removeFilteredChains: (state, action) => {
      const index = state.filteredChains.indexOf(action.payload);

      if (index !== -1) state.filteredChains.splice(index);
    },
  },
});

export const {
  setCardsArray,
  insertCardsArray,
  setSearchValue,
  selectAll,
  addSelected,
  removeSelected,
  addFilteredChains,
  removeFilteredChains,
} = cardSlice.actions;

export default cardSlice.reducer;

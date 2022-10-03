import * as React from "react";

import useLocalStorage from "./useLocalStorage";

export interface Item {
  id: string;
  price: number;
  itemTotal?: number;
  [key: string]: any;
}

interface InitialState {
  id: string;
  items: Item[];
  isWishlistEmpty: boolean;
  totalWishlistItems: number;
  wishlistTotal: number;
  metadata?: Metadata;
}

export interface Metadata {
  [key: string]: any;
}

interface WishlistProviderState extends InitialState {
  addWishlistItem: (item: Item) => void;
  removeWishlistItem: (id: Item["id"]) => void;
  setWishlistItems: (items: Item[]) => void;
  emptyWishlist: () => void;
  getWishlistItem: (id: Item["id"]) => any | undefined;
  inWishlist: (id: Item["id"]) => boolean;
  clearWishlistMetadata: () => void;
  setWishlistMetadata: (metadata: Metadata) => void;
  updateWishlistMetadata: (metadata: Metadata) => void;
}

export type Actions =
  | { type: "SET_ITEMS"; payload: Item[] }
  | { type: "ADD_ITEM"; payload: Item }
  | { type: "REMOVE_ITEM"; id: Item["id"] }
  | { type: "EMPTY_WISHLIST" }
  | { type: "CLEAR_WISHLIST_META" }
  | { type: "SET_WISHLIST_META"; payload: Metadata }
  | { type: "UPDATE_WISHLIST_META"; payload: Metadata };

export const initialState: any = {
  items: [],
  isWishlistEmpty: true,
  totalWishlistItems: 0,
  wishlistTotal: 0,
  metadata: {},
};

const WishlistContext = React.createContext<WishlistProviderState | undefined>(
  initialState
);

export const createWishlistIdentifier = (len = 12) =>
  [...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join("");

export const useWishlist = () => {
  const context = React.useContext(WishlistContext);

  if (!context) throw new Error("Expected to be wrapped in a WishlistProvider");

  return context;
};

function reducer(state: WishlistProviderState, action: Actions) {
  switch (action.type) {
    case "SET_ITEMS":
      return generateWishlistState(state, action.payload);

    case "ADD_ITEM": {
      var tempItems = state.items;
      tempItems.push(action.payload);
      const items = tempItems;

      return generateWishlistState(state, items);
    }

    case "REMOVE_ITEM": {
      const items = state.items.filter((i: Item) => i.id !== action.id);

      return generateWishlistState(state, items);
    }

    case "EMPTY_WISHLIST":
      return initialState;

    case "CLEAR_WISHLIST_META":
      return {
        ...state,
        metadata: {},
      };

    case "SET_WISHLIST_META":
      return {
        ...state,
        metadata: {
          ...action.payload,
        },
      };

    case "UPDATE_WISHLIST_META":
      return {
        ...state,
        metadata: {
          ...state.metadata,
          ...action.payload,
        },
      };

    default:
      throw new Error("No action specified");
  }
}

const generateWishlistState = (state = initialState, items: Item[]) => {
  const totalWishlistItems = items.length;
  const isWishlistEmpty = totalWishlistItems === 0;

  return {
    ...initialState,
    ...state,
    items: calculateItemTotals(items),
    totalWishlistItems,
    wishlistTotal: calculateTotal(items),
    isWishlistEmpty,
  };
};

const calculateItemTotals = (items: Item[]) =>
  items.map(item => ({
    ...item,
    itemTotal: item.price,
  }));

const calculateTotal = (items: Item[]) =>
  items.reduce((total, item) => total + item.price, 0);

export const WishlistProvider: React.FC<{
  children?: React.ReactNode;
  id?: string;
  defaultItems?: Item[];
  onSetItems?: (items: Item[]) => void;
  onItemAdd?: (payload: Item) => void;
  onItemRemove?: (id: Item["id"]) => void;
  storage?: (
    key: string,
    initialValue: string
  ) => [string, (value: Function | string) => void];
  metadata?: Metadata;
}> = ({
  children,
  id: wishlistId,
  defaultItems = [],
  onSetItems,
  onItemAdd,
  onItemRemove,
  storage = useLocalStorage,
  metadata,
}) => {
  const id = wishlistId ? wishlistId : createWishlistIdentifier();

  const [savedWishlist, saveWishlist] = storage(
    wishlistId ? `react-use-wishlist-${id}` : `react-use-wishlist`,
    JSON.stringify({
      id,
      ...initialState,
      items: defaultItems,
      metadata,
    })
  );

  const [state, dispatch] = React.useReducer(reducer, JSON.parse(savedWishlist));
  React.useEffect(() => {
    saveWishlist(JSON.stringify(state));
  }, [state, saveWishlist]);

  const setWishlistItems = (items: Item[]) => {
    dispatch({
      type: "SET_ITEMS",
      payload: items.map(item => (item)),
    });

    onSetItems && onSetItems(items);
  };

  const addWishlistItem = (item: Item) => {
    if (!item.id) throw new Error("You must provide an `id` for items");

    const currentItem = state.items.find((i: Item) => i.id === item.id);

    if (currentItem)
      throw new Error("This item is already added to wishlist");

    if (!item.hasOwnProperty("price"))
      throw new Error("You must pass a `price` for new items");

    
    const payload = item;

    dispatch({ type: "ADD_ITEM", payload });

    onItemAdd && onItemAdd(payload);

    return;
  
  };

  const removeWishlistItem = (id: Item["id"]) => {
    if (!id) return;

    dispatch({ type: "REMOVE_ITEM", id });

    onItemRemove && onItemRemove(id);
  };

  const emptyWishlist = () =>
    dispatch({
      type: "EMPTY_WISHLIST",
    });

  const getWishlistItem = (id: Item["id"]) =>
    state.items.find((i: Item) => i.id === id);

  const inWishlist = (id: Item["id"]) => state.items.some((i: Item) => i.id === id);

  const clearWishlistMetadata = () => {
    dispatch({
      type: "CLEAR_WISHLIST_META",
    });
  };

  const setWishlistMetadata = (metadata: Metadata) => {
    if (!metadata) return;

    dispatch({
      type: "SET_WISHLIST_META",
      payload: metadata,
    });
  };

  const updateWishlistMetadata = (metadata: Metadata) => {
    if (!metadata) return;

    dispatch({
      type: "UPDATE_WISHLIST_META",
      payload: metadata,
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        getWishlistItem,
        inWishlist,
        setWishlistItems,
        addWishlistItem,
        removeWishlistItem,
        emptyWishlist,
        clearWishlistMetadata,
        setWishlistMetadata,
        updateWishlistMetadata,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

import {
  WishlistProvider,
  createWishlistIdentifier,
  initialState,
  useWishlist,
} from "../src";
import React, { FC, HTMLAttributes, ReactChild } from "react";
import { act, renderHook } from "@testing-library/react-hooks";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactChild;
}

afterEach(() => window.localStorage.clear());

describe("createWishlistIdentifier", () => {
  test("returns a 12 character string by default", () => {
    const id = createWishlistIdentifier();

    expect(id).toHaveLength(12);
  });

  test("returns a custom length string", () => {
    const id = createWishlistIdentifier(20);

    expect(id).toHaveLength(20);
  });

  test("created id is unique", () => {
    const id = createWishlistIdentifier();
    const id2 = createWishlistIdentifier();

    expect(id).not.toEqual(id2);
  });
});

describe("WishlistProvider", () => {
  test("uses ID for wishlist if provided", () => {
    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider id="test">{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    expect(result.current.id).toBeDefined();
    expect(result.current.id).toEqual("test");
  });

  test("creates an ID for wishlist if non provided", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    expect(result.current.id).toBeDefined();
    expect(result.current.id).toHaveLength(12);
  });

  test("initial wishlist meta state is set", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    expect(result.current.items).toEqual(initialState.items);
    expect(result.current.totalWishlistItems).toEqual(initialState.totalWishlistItems);
    expect(result.current.isWishlistEmpty).toBe(initialState.isWishlistEmpty);
    expect(result.current.wishlistTotal).toEqual(initialState.wishlistTotal);
  });

  test("sets wishlist metadata", () => {
    const metadata = {
      coupon: "abc123",
      notes: "Leave on door step",
    };

    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider metadata={metadata}>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    expect(result.current.metadata).toEqual(metadata);
  });
});

describe("addWishlistItem", () => {
  test("adds item to wishlist", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    const item = { id: "test", price: 1000 };

    act(() => result.current.addWishlistItem(item));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalWishlistItems).toBe(1);
  });

  test("updates wishlist meta state", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    const item = { id: "test", price: 1000 };

    act(() => result.current.addWishlistItem(item));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalWishlistItems).toBe(1);
    expect(result.current.wishlistTotal).toBe(1000);
    expect(result.current.isWishlistEmpty).toBe(false);
  });

  test("allows free item", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    const item = { id: "test", price: 0 };

    act(() => result.current.addWishlistItem(item));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalWishlistItems).toBe(1);
    expect(result.current.wishlistTotal).toBe(0);
    expect(result.current.isWishlistEmpty).toBe(false);
  });

  test("triggers onItemAdd while adding an item to wishlist", () => {
    let called = false;

    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider onItemAdd={() => (called = true)}>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    const item = { id: "test", price: 1000 };

    act(() => result.current.addWishlistItem(item));

    expect(called).toBe(true);
  });

  test("add item with price", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    const item = { id: "test", price: 1000 };

    act(() => result.current.addWishlistItem(item));

    expect(result.current.wishlistTotal).toBe(1000);
  });
});

describe("removeWishlistItem", () => {
  test("updates wishlist meta state", () => {
    const items = [{ id: "test", price: 1000 }];
    const [item] = items;

    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider defaultItems={items}>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    act(() => result.current.removeWishlistItem(item.id));

    expect(result.current.items).toEqual([]);
    expect(result.current.totalWishlistItems).toBe(0);
    expect(result.current.isWishlistEmpty).toBe(true);
  });

  test("triggers onItemRemove when removing item", () => {
    let called = false;

    const item = { id: "test", price: 1000 };

    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider defaultItems={[item]} onItemRemove={() => (called = true)}>
        {children}
      </WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    act(() => result.current.removeWishlistItem(item.id));

    expect(called).toBe(true);
  });
});

describe("emptyWishlist", () => {
  test("updates wishlist meta state", () => {
    const items = [{ id: "test", price: 1000 }];

    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider defaultItems={items}>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    act(() => result.current.emptyWishlist());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalWishlistItems).toBe(0);
    expect(result.current.isWishlistEmpty).toBe(true);
  });
});

describe("updateWishlistMetadata", () => {
  test("clears wishlist metadata", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    const metadata = {
      coupon: "abc123",
      notes: "Leave on door step",
    };

    act(() => result.current.updateWishlistMetadata(metadata));

    expect(result.current.metadata).toEqual(metadata);

    act(() => result.current.clearWishlistMetadata());

    expect(result.current.metadata).toEqual({});
  });

  test("sets wishlist metadata", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    const metadata = {
      coupon: "abc123",
      notes: "Leave on door step",
    };

    act(() => result.current.updateWishlistMetadata(metadata));

    expect(result.current.metadata).toEqual(metadata);

    const replaceMetadata = {
      delivery: "same-day",
    };

    act(() => result.current.setWishlistMetadata(replaceMetadata));

    expect(result.current.metadata).toEqual(replaceMetadata);
  });

  test("updates wishlist metadata", () => {
    const { result } = renderHook(() => useWishlist(), {
      wrapper: WishlistProvider,
    });

    const metadata = {
      coupon: "abc123",
      notes: "Leave on door step",
    };

    act(() => result.current.updateWishlistMetadata(metadata));

    expect(result.current.metadata).toEqual(metadata);
  });

  test("merge new metadata with existing", () => {
    const initialMetadata = {
      coupon: "abc123",
    };

    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider metadata={initialMetadata}>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    const metadata = {
      notes: "Leave on door step",
    };

    act(() => result.current.updateWishlistMetadata(metadata));

    expect(result.current.metadata).toEqual({
      ...initialMetadata,
      ...metadata,
    });
  });
});
describe("setItems", () => {
  test("set wishlist items state", () => {
    const items = [
      { id: "test", price: 1000 },
      { id: "test2", price: 2000 },
    ];

    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider defaultItems={[]}>{children}</WishlistProvider>
    );
    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    act(() => result.current.setWishlistItems(items));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalWishlistItems).toBe(2);
    expect(result.current.isWishlistEmpty).toBe(false);
    expect(result.current.items).toContainEqual(
      expect.objectContaining({ id: "test2", price: 2000 })
    );
  });
  
  test("current items is replaced when setItems has been called with a new set of items", () => {
    const itemToBeReplaced = { id: "test", price: 1000 };
    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider defaultItems={[itemToBeReplaced]}>{children}</WishlistProvider>
    );
    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });
    const items = [
      { id: "test2", price: 2000 },
      { id: "test3", price: 3000 },
    ];
    act(() => result.current.setWishlistItems(items));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items).not.toContainEqual(
      expect.objectContaining(itemToBeReplaced)
    );
  });
  test("trigger onSetItems when setWishlistItems is called", () => {
    let called = false;

    const wrapper: FC<Props> = ({ children }) => (
      <WishlistProvider onSetItems={() => (called = true)}>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), {
      wrapper,
    });

    const items = [{ id: "test", price: 1000 }];

    act(() => result.current.setWishlistItems(items));

    expect(called).toBe(true);
  });
});

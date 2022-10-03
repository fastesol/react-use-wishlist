<h1 align="center">
  react-use-wishlist
</h1>
<p align="center">
🛒 A lightweight wishlist hook for React, Next.js, and Gatsby
</p>

## Why?

- **No dependencies**
- 💳 Not tied to any payment gateway, or checkout - create your own!
- 🔥 Persistent wishlists with local storage, or your own adapter
- ⭐️ Supports multiples wishlists per page
- 🛒 Flexible wishlist item schema
- 🥞 Works with Next, Gatsby, React
- ♻️ Trigger your own side effects with wishlist handlers (on item add, remove)
- 🛠 Built with TypeScript
- ✅ Fully tested
- 🌮 Used by [Heathway Foods](https://heathwayfoods.com/?ref=react-use-wishlist)

## Quick Start

```js
import { WishlistProvider, useWishlist } from "react-use-wishlist";

function Page() {
  const { addWishlistItem } = useWishlist();

  const products = [
    {
      id: 1,
      name: "Malm",
      price: 9900
    },
    {
      id: 2,
      name: "Nordli",
      price: 16500,
    },
    {
      id: 3,
      name: "Kullen",
      price: 4500
    },
  ];

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>
          <button onClick={() => addWishlistItem(p)}>Add to wishlist</button>
        </div>
      ))}
    </div>
  );
}

function Wishlist() {
  const {
    isWishlistEmpty,
    totalWishlistItems,
    items,
    removeWishlistItem,
  } = useWishlist();

  if (isWishlistEmpty) return <p>Your wishlist is empty</p>;

  return (
    <>
      <h1>Wishlist ({totalWishlistItems})</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} &mdash;
            <button onClick={() => removeWishlistItem(item.id)}>&times;</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function App() {
  return (
    <WishlistProvider>
      <Page />
      <Wishlist />
    </WishlistProvider>
  );
}
```

## Install

```bash
npm install react-use-wishlist # yarn add react-use-wishlist
```

## `WishlistProvider`

You will need to wrap your application with the `WishlistProvider` component so that the `useWishlist` hook can access the wishlist state.

Wishlists are persisted across visits using `localStorage`, unless you specify your own `storage` adapter.

#### Usage

```js
import React from "react";
import ReactDOM from "react-dom";
import { WishlistProvider } from "react-use-wishlist";

ReactDOM.render(
  <WishlistProvider>{/* render app/wishlist here */}</WishlistProvider>,
  document.getElementById("root")
);
```

#### Props

| Prop           | Required | Description                                                                                                                                                |
| -------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`           | _No_     | `id` for your wishlist to enable automatic wishlist retrieval via `window.localStorage`. If you pass a `id` then you can use multiple instances of `WishlistProvider`. |
| `onSetItems`   | _No_     | Triggered only when `setWishlistItems` invoked.                                                                                                                    |
| `onItemAdd`    | _No_     | Triggered on items added to your wishlist                                                |
| `onItemRemove` | _No_     | Triggered on items removed from your wishlist.                                                                                                                 |
| `storage`      | _No_     | Must return `[getter, setter]`.                                                                                                                            |
| `metadata`     | _No_     | Custom global state on the wishlist. Stored inside of `metadata`.                                                                                              |
## `useWishlist`

The `useWishlist` hook exposes all the getter/setters for your wishlist state.

### `setWishlistItems(items)`

The `setWishlistItems` method should be used to set all items in the wishlist. This will overwrite any existing wishlist items.


#### Args

- `items[]` (**Required**): An array of wishlist item object. You must provide an `id` and `price` value for new items that you add to wishlist.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { setWishlistItems } = useWishlist();

const products = [
  {
    id: "ckb64v21u000001ksgw2s42ku",
    name: "Fresh Foam 1080v9",
    brand: "New Balance",
    color: "Neon Emerald with Dark Neptune",
    size: "US 10",
    width: "B - Standard",
    sku: "W1080LN9",
    price: 15000,
  },
  {
    id: "cjld2cjxh0000qzrmn831i7rn",
    name: "Fresh Foam 1080v9",
    brand: "New Balance",
    color: "Neon Emerald with Dark Neptune",
    size: "US 9",
    width: "B - Standard",
    sku: "W1080LN9",
    price: 15000,
  },
];

setWishlistItems(products);
```

### `addWishlistItem(item)`

The `addWishlistItem` method should be used to add items to the wishlist.

#### Args

- `item` (**Required**): An object that represents your wishlist item. You must provide an `id` and `price` value for new items that you add to wishlist.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { addWishlistItem } = useWishlist();

const product = {
  id: "cjld2cjxh0000qzrmn831i7rn",
  name: "Fresh Foam 1080v9",
  brand: "New Balance",
  color: "Neon Emerald with Dark Neptune",
  size: "US 9",
  width: "B - Standard",
  sku: "W1080LN9",
  price: 15000,
};

addWishlistItem(product);
```

### `removeWishlistItem(itemId)`

The `removeWishlistItem` method should be used to remove an item from the wishlist.

#### Args

- `itemId` (**Required**): The wishlist item `id` you want to remove.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { removeWishlistItem } = useWishlist();

removeWishlistItem("cjld2cjxh0000qzrmn831i7rn");
```

### `emptyWishlist()`

The `emptyWishlist()` method should be used to remove all wishlist items, and resetting wishlist totals to the default `0` values.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { emptyWishlist } = useWishlist();

emptyWishlist();
```

### `clearWishlistMetadata()`

The `clearWishlistMetadata()` will reset the `metadata` to an empty object.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { clearWishlistMetadata } = useWishlist();

clearWishlistMetadata();
```

### `setWishlistMetadata(object)`

The `setWishlistMetadata()` will replace the `metadata` object on the wishlist. You must pass it an object.

#### Args

- `object`: A object with key/value pairs. The key being a string.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { setWishlistMetadata } = useWishlist();

setWishlistMetadata({ notes: "This is the only metadata" });
```

### `updateWishlistMetadata(object)`

The `updateWishlistMetadata()` will update the `metadata` object on the wishlist. You must pass it an object. This will merge the passed object with the existing metadata.

#### Args

- `object`: A object with key/value pairs. The key being a string.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { updateWishlistMetadata } = useWishlist();

updateWishlistMetadata({ notes: "Leave in shed" });
```

### `items = []`

This will return the current wishlist items in an array.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { items } = useWishlist();
```

### `isWishlistEmpty = false`

A quick and easy way to check if the wishlist is empty. Returned as a boolean.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { isWishlistEmpty } = useWishlist();
```

### `getWishlistItem(itemId)`

Get a specific wishlist item by `id`. Returns the item object.

#### Args

- `itemId` (**Required**): The `id` of the item you're fetching.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { getWishlistItem } = useWishlist();

const myItem = getWishlistItem("cjld2cjxh0000qzrmn831i7rn");
```

### `inWishlist(itemId)`

Quickly check if an item is in the wishlist. Returned as a boolean.

#### Args

- `itemId` (**Required**): The `id` of the item you're looking for.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { inWishlist } = useWishlist();

inWishlist("cjld2cjxh0000qzrmn831i7rn") ? "In wishlist" : "Not in wishlist";
```

### `totalWishlistItems = 0`

This returns the items in the wishlist as an integer.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { totalItems } = useWishlist();
```

### `wishlistTotal = 0`

This returns the total value of all items in the wishlist.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { wishlistTotal } = useWishlist();
```

### `metadata = {}`

This returns the metadata set with `updateWishlistMetadata`. This is useful for storing additional wishlist, or checkout values.

#### Usage

```js
import { useWishlist } from "react-use-wishlist";

const { metadata } = useWishlist();
```

## Contributors ✨

This Package is created by using the notrab/react-use-cart git repo. So, thanks goes to ([notrab/react-use-cart](https://github.com/notrab/react-use-cart)) and all of it's contributors.
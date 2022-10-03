import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WishlistProvider, useWishlist } from "../.";

const App = () => {
  return (
    <WishlistProvider>
      <h1>Hello</h1>
    </WishlistProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

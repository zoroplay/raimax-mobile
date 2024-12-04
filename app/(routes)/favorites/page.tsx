import React, { Suspense } from "react";
import { FavoritesBlock } from "@/_blocks";

const Favorites = () => {
  return (
    <Suspense>
      <FavoritesBlock />
    </Suspense>
  );
};

export default Favorites;

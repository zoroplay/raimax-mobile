// import enviroment from "configs/enviroment.config";
// import { REHYDRATE } from "redux-persist";
import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../custom-query/customQuery";
// import { SkipToken } from "@reduxjs/toolkit/dist/query";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["User", "Deposit", "Bet", "Withdrawal", "Favourite"],
  endpoints: (builder) => ({}),
  // refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 50000,
  refetchOnReconnect: true,
});
export default apiSlice;

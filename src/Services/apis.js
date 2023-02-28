import { Http } from "../Utils";

export const fetchGlobalVars = () => Http.get(`/utilities/globalvariables`);

export const fetchBonusList = () =>
  Http.get(`/utilities/bonuslist?section=onliners`);

export const getSportMenu = (period) =>
  Http.get(`/sports/get-menu?period=${period}`);

export const fetchFixturesByDate = (date) =>
  Http.get(`/sports/get-fixtures-by-date?date=${date}&channel=mobile`);

export const fetchFixturesByDateSport = (date, sport_id) =>
  Http.get(
    `/sports/get-fixtures-by-sport-date?date=${date}&sid=${sport_id}&channel=mobile`
  );

export const upcomingFixtures = () => Http.get(`/sports/mobile/upcoming`);

export const getSports = (startDate, endDate) => Http.get(`/sports/group-fixtures-by-sport?date=${startDate}&end_date=${endDate}`);

export const fetchHighlights = () => Http.get(`/sports/mobile/highlights`);

export const searchFixtures = (q) => Http.get(`/sports/search?q=${q}&channel=mobile`);

export const getFixture = (eventId) =>
  Http.get(`sports/get-fixture/${eventId}`);

export const getMatches = (tid) => Http.get(`sports/get-matches/${tid}`);

export const getFixtures = (tid, sid) =>
  Http.get(`sports/get-fixtures/${tid}?sid=${sid}&source=mobile`);

export const loadCoupon = (code, action) =>
  Http.get(`sports/booking/${code}?action=${action}`);

export const findCoupon = (code) => Http.get(`sports/find-coupon/${code}`);

export const login = ({ username, password }) =>
  Http.post(`auth/login?source=mobile`, { username, password });

export const sendLogout = () =>
  Http.get(`auth/logout`)
    .then((res) => {})
    .catch((err) => {});
export const authDetails = () => Http.get(`auth/details`);

export const register = (data) =>
  Http.post(`auth/register?client=mobile`, data);

export const getOpenBets = () => Http.get(`user/account/open-bets`);

export const getSettledBets = (data) =>
  Http.post(`user/account/settled-bets`, data);

export const getTransactions = (data) =>
  Http.post(`user/account/get-transactions`, data);

export const getBonusTransactions = (data, page) =>
  Http.post(`user/account/get-bonus-transactions?page=${page}`, data);

export const getBonuses = () => Http.get(`user/account/get-bonuses`);

export const redeemBonus = () =>
  Http.get(`user/account/redeem-bonus?source=mobile`);

export const getWithdrawalInfo = () => Http.get(`user/account/withdrawal-info`);

export function saveTransaction(res) {
  Http.post("utilities/save-payment-transaction", res)
    .then((res) => {})
    .catch((err) => {});
}

export const getGatewayKeys = (gateway) =>
  Http.get(`utilities/get-gateway-keys/${gateway}`);

export const changePassword = (data) =>
  Http.post("user/account/change-password", data);
export const updateProfile = (data) =>
  Http.post("/user/account/save-personal-data", data);

export const postWithdrawal = (data) =>
  Http.post("user/account/withdraw", data);

export const getMarkets = (tid, sid, market_id, date = "") =>
  Http.get(
    `sports/get-odds/${tid}?sid=${sid}&market_id=${market_id}&date=${date}`
  );

export const saveNewAgent = (data) => Http.post("/save-new-agent", data);

export const getLiveFixtures = () => Http.get(`/sports/live`);

export const getLiveFixtureData = (eventId) =>
  Http.get(`sports/live/${eventId}/en`);

export const getUpcomingLive = () => Http.get("/sports/live/upcoming");

export const getCombos = (couponData) =>
  Http.post("/sports/get-combos", { selections: couponData.selections });

export const getSplitProps = async (couponData) => {
  const res = await Http.post("/sports/get-split-props", {
    selections: couponData.selections,
  });
  couponData.noOfCombos = res.noOfCombos;
  couponData.minOdds = res.minOdds;
  couponData.maxOdds = res.maxOdds;
  couponData.maxBonus = res.maxBonus;
  couponData.minWin = res.minWin;
  couponData.maxWin = res.maxWin;

  return couponData;
};

export const sendVerification = (data) =>
  Http.post(`auth/send-verification-code`, data);

export const confirmVerification = (data) =>
  Http.post(`auth/confirm-verification-code`, data);

export const resetPassword = (data) => Http.post(`auth/reset-password`, data);

export const sendDeposit = (data) =>
  Http.post("/user/account/send-deposit", data);

export const sendWithdrawal = (data) =>
  Http.post("/user/account/send-withdrawal", data);

export const playerWithdrawal = (data) =>
  Http.post("/user/account/online/withdraw", data);

export const getTipsters = () => Http.get("/sports/tipsters/all");

export const getJackpots = () => Http.get("/sports/jackpots");

export const saveTipsterBet = (data) => Http.post("/sports/tipsters/add", data);

export const getTipsterBetslips = (user_id) =>
  Http.get(`/sports/tipsters/get-betslips/${user_id}`);

export const updateSelfExclusion = (data) =>
  Http.post("/user/account/self-exclusion", data);

export const updateDepositLimit = (data) =>
  Http.post("/user/account/deposit-limit", data);

  export const shopDeposit = (data) =>
  Http.post("/user/account/deposit?channel=mobile", data);

export const updateMarketingPreferences = (data) =>
  Http.post("/user/account/marketing-preferences", data);

export const getAllBanks = () => Http.get(`/utilities/list-banks`);

export const bankWithdrawal = (payload) =>
  Http.post("user/account/withdraw", payload);

export const getBankDetails = () => Http.get(`/user/account/get-bank-account`);

export const fetchFixturesByDateRangeSport = (
  startDate,
  endDate,
  market_id,
  sport_id,
  page
) =>
  Http.get(
    `/sports/get-fixtures-by-date?date=${startDate}&end_date=${endDate}&sid=${sport_id}&market=${market_id}&channel=mobile&limit=10&page=${page}`
  );

export const sendOtp = () => Http.post(`/sendsms`);
export const verifyCode = (otp) =>
  Http.post(`/sms/pin_verification/verify`, otp);

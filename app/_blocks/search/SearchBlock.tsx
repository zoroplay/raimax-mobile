"use client";
import React, { useEffect, useState } from "react";
import "./SearchBlock.scss";
import { Empty, FooterSearch, SearchEvent, SearchLive } from "@/_components";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useSearchEventQuery } from "@/_services/sport.service";
import { useAppDispatch, useAppSelector, useDebounce } from "@/_hooks";
import { updateHistory } from "@/_redux/slices/modal.slice";
import { Oval } from "react-loader-spinner";
import { CgSearchLoading } from "react-icons/cg";

const SearchBlock = () => {
  const [search, setSearch] = useState<string>("");
  const [live, setLive] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const router = useRouter();
  const { searchHistory } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const debouncedSearch = useDebounce(search, 2000);

  const {
    isLoading: isLoading,
    data,
    isFetching,
  } = useSearchEventQuery(
    { search: debouncedSearch },
    { skip: search.length < 3 }
  );
  

  useEffect(() => {
    debouncedSearch && dispatch(updateHistory(debouncedSearch));
  }, [debouncedSearch]);

  return (
    <div
      className="search_block"
      style={{ paddingBottom: search ? "60px" : "" }}
    >
      <div className="search_block_input_wrap">
        <div className="between search_block_input_icon">
          <div className="search_block_icon" onClick={() => router.back()}>
            <IoMdArrowRoundBack />
          </div>
          <div className="search_block_input_wrap">
            <input
              className="search_block_input"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
        </div>
      </div>
      {!search ? (
        <div className="search_block_input_con">
          <div className="trend_search">
            <div className="trend_search_title">Trending Search</div>
            <div className="trend_search_items start">
              <div
                className="trend_search_item"
                onClick={() => setSearch("manchester")}
              >
                Manchester
              </div>
              <div
                className="trend_search_item"
                onClick={() => setSearch("chelsea")}
              >
                Chelsea
              </div>
              <div
                className="trend_search_item"
                onClick={() => setSearch("madrid")}
              >
                Madrid
              </div>
              <div
                className="trend_search_item"
                onClick={() => setSearch("arsenal")}
              >
                Arsenal
              </div>
              <div
                className="trend_search_item"
                onClick={() => setSearch("liverpool")}
              >
                Liverpool
              </div>
              <div
                className="trend_search_item"
                onClick={() => setSearch("barcelona")}
              >
                Barcelona
              </div>
            </div>
          </div>
          <div className="history">
            <div className="between history_search_wrap">
              <div className="history_search_title">Search History</div>
              <div
                className="history_search_clear"
                onClick={() => dispatch(updateHistory("delete-all"))}
              >
                Clear
              </div>
            </div>
            <div className="history_item_wrap start col">
              {searchHistory?.map((item, idx) => (
                <div
                  key={idx}
                  className="start history_item"
                  onClick={() => setSearch(item)}
                >
                  <div className="history_item_icon">
                    <BiSearch />
                  </div>
                  <div className="history_item_text">
                    <div>{item}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : search.length < 3 ? (
        <div className="char_wrap center">
          <div className="char">Please enter at least three characters </div>
        </div>
      ) : isFetching ? (
        <div className="p_20 center" style={{ width: "100%" }}>
          <Oval
            height={50}
            width={50}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : !data?.fixtures ? (
        <div className="p_20">
          <Empty title="No Fixtures" icon={<CgSearchLoading />} />
        </div>
      ) : (
        <>
          <div className="search_block_live">
            <SearchLive fixturesData={data} isLoading={isLoading} />
          </div>
          <div className="search_block_event">
            <SearchEvent
              fixturesData={data}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          </div>
        </>
      )}
      {search && <FooterSearch />}
    </div>
  );
};

export default SearchBlock;

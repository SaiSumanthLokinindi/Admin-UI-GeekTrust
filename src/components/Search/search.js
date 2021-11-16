import classes from "./search.module.css";
import { useRef } from "react";
const Search = (props) => {
  const { searchMember } = props;
  const searchKeyword = useRef();
  const sendSearchQuery = () => {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        searchMember(searchKeyword.current.value);
      }, 300);
    };
  };

  return (
    <div className={`${classes["search-div"]}`}>
      <input
        type="text"
        ref={searchKeyword}
        placeholder="Search by name, email or role"
        onChange={sendSearchQuery()}
      ></input>
    </div>
  );
};

export default Search;

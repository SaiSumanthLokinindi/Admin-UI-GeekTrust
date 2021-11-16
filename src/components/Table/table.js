import classes from "./table.module.css";
import Card from "../UI/Card/card";
import React from "react";
import Member from "../Member/member";
import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useReducer, useEffect } from "react";
import { membersActions } from "../../store/members/members-slice";
import emptyDataImg from "../../assets/emptyData.svg";
const Search = React.lazy(() => import("../Search/search"));
const Pagination = React.lazy(() => import("../Pagination/pagination"));

const Table = () => {
  const dispatch = useDispatch();
  const membersData = useSelector((state) => state.members.membersData);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");

  const selectAllReducer = (state, action) => {
    const currentTableMembers = tableData.map((member) => member.id);
    switch (action.type) {
      case "toggle":
        if (state) {
          setSelectedMembers([
            ...selectedMembers.filter(
              (memberId) => !currentTableMembers.includes(memberId)
            ),
          ]);
          return !state;
        } else {
          let newSelectedMembers = [...currentTableMembers, ...selectedMembers];
          newSelectedMembers = [...new Set(newSelectedMembers)];
          setSelectedMembers(newSelectedMembers);
          return !state;
        }
      case "togglePageActive":
        if (
          currentTableMembers.every((id) => selectedMembers.includes(id)) &&
          tableData.length > 0
        )
          return true;
        else return false;
      case "resetToggle":
        return false;
      default:
        return state;
    }
  };

  const [selectAll, dispatcher] = useReducer(selectAllReducer, false);

  const searchMember = useCallback(
    (searchKeyword) => {
      searchKeyword = searchKeyword.toLowerCase();
      setSearch(searchKeyword);
      setSearchData([
        ...membersData.filter(
          (member) =>
            member.name.toLowerCase().includes(searchKeyword) ||
            member.email.toLowerCase().includes(searchKeyword) ||
            member.role.toLowerCase().includes(searchKeyword)
        ),
      ]);
    },
    [setSearch, setSearchData, membersData]
  );

  useEffect(() => {
    searchMember(search);
  }, [membersData, searchMember, search]);

  const checkPageMembersSelected = useCallback(() => {
    dispatcher({ type: "togglePageActive" });
  }, [dispatcher]);

  const fetchMembersData = useCallback(
    (members) => {
      setTableData(members);
    },
    [setTableData]
  );

  const selectMembers = (id) => {
    setSelectedMembers((prevState) => {
      let currentSelectedMembers = [...prevState, id];
      return currentSelectedMembers;
    });
  };

  const checkMemberIsSelected = useCallback(
    (id) => {
      if (selectedMembers.indexOf(id) > -1) {
        setSelectedMembers((prevState) => {
          return prevState.filter((memberId) => memberId !== id);
        });
      }
    },
    [selectedMembers, setSelectedMembers]
  );

  const deSelectMembers = (id) => {
    setSelectedMembers((prevState) => {
      let currentSelectedMembers = prevState.filter(
        (memberId) => memberId !== id
      );
      return currentSelectedMembers;
    });
  };

  const deleteSelectedMembers = () => {
    dispatch(membersActions.deleteSelected(selectedMembers));
    dispatcher({ type: "resetToggle" });
    setSelectedMembers([]);
  };

  const toggleSelectAllHandler = () => {
    dispatcher({ type: "toggle" });
  };

  return (
    <>
      <Search searchMember={searchMember} />
      <Card>
        {tableData.length !== 0 && (
          <>
            <table className={`${classes.table}`} cellSpacing="0">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={toggleSelectAllHandler}
                      checked={selectAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((member) => (
                  <Member
                    key={member.id}
                    memberId={member.id}
                    memberName={member.name}
                    memberEmail={member.email}
                    memberRole={member.role}
                    onSelectMember={selectMembers}
                    onDeSelectMember={deSelectMembers}
                    isSelected={selectedMembers.indexOf(member.id) > -1}
                    checkMemberIsSelected={checkMemberIsSelected}
                  />
                ))}
              </tbody>
            </table>
            <div className={`${classes["selected-members-actions"]}`}>
              <button
                disabled={!selectedMembers.length > 0}
                onClick={deleteSelectedMembers}
              >
                Delete Selected
              </button>
              <span className="hint-text" style={{ padding: ".5rem 1rem" }}>
                {selectedMembers.length > 0 ? selectedMembers.length : "No"}{" "}
                members selected
              </span>
            </div>
          </>
        )}
        {tableData.length === 0 && (
          <div className={`${classes["empty-data-div"]}`}>
            <img src={emptyDataImg} alt="empty-data" />
            <div className="hint-text" style={{ margin: "1rem 0" }}>
              No data to show
            </div>
          </div>
        )}
        <Pagination
          data={search === "" ? membersData : searchData}
          pageCount={10}
          sendMembersData={fetchMembersData}
          checkPageMembersSelected={checkPageMembersSelected}
        />
      </Card>
    </>
  );
};

export default Table;

import { membersActions } from "./members-slice";

export const fetchMemberData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      if (!response.ok) throw new Error("Failed to fetch memeber data");
      const data = await response.json();
      return data;
    };

    try {
      const membersData = await fetchData();
      dispatch(membersActions.saveMembersDataToStore(membersData));
    } catch (err) {
      console.log(err);
    }
  };
};

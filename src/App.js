import "./App.css";
import React, { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMemberData } from "./store/members/members-actions";
const Table = React.lazy(() => import("./components/Table/table"));

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMemberData());
  }, [dispatch]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Table />
      </Suspense>
    </>
  );
}

export default App;

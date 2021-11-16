import classes from "./member.module.css";
import { FaTrash, FaEdit, FaSave, FaWindowClose } from "react-icons/fa";
import { membersActions } from "../../store/members/members-slice";
import { useDispatch } from "react-redux";
import { useState, useRef, useReducer } from "react";

const initialFormState = {
  name: {
    isValid: true,
    errMessage: "",
  },
  email: {
    isValid: true,
    errMessage: "",
  },
  role: {
    isValid: true,
    errMessage: "",
  },
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "nameError":
      return { ...state, name: { isValid: false, errMessage: action.payload } };
    case "nameIsValid":
      return { ...state, name: { isValid: true, errMessage: "" } };
    case "emailError":
      return {
        ...state,
        email: { isValid: false, errMessage: action.payload },
      };
    case "emailIsValid":
      return { ...state, email: { isValid: true, errMessage: "" } };
    case "roleError":
      return { ...state, role: { isValid: false, errMessage: action.payload } };
    case "roleIsValid":
      return { ...state, role: { isValid: true, errMessage: "" } };
    case "resetFormState":
      return initialFormState;
    default:
      return state;
  }
};

const Member = (props) => {
  const dispatch = useDispatch();
  const selectMember = useRef();
  const [formState, dispatcher] = useReducer(formReducer, initialFormState);
  const {
    memberId,
    memberName,
    memberEmail,
    memberRole,
    onSelectMember,
    onDeSelectMember,
    isSelected,
    checkMemberIsSelected,
  } = props;
  const [editActive, setEditActive] = useState(false);
  const [name, setName] = useState(memberName);
  const [email, setEmail] = useState(memberEmail);
  const [role, setRole] = useState(memberRole);

  const deleteMemberHandler = () => {
    checkMemberIsSelected(memberId);
    dispatch(membersActions.deleteMember(memberId));
  };

  const editMemeberHanlder = () => {
    setEditActive(true);
  };

  const nameChangeHandler = (e) => {
    setName(e.target.value);
    if (e.target.value === "") {
      dispatcher({ type: "nameError", payload: "name cannot be empty" });
    } else if (!e.target.value.match(/^[A-za-z\s]+$/)) {
      dispatcher({ type: "nameError", payload: "invalid name" });
    } else {
      dispatcher({ type: "nameIsValid" });
    }
  };

  const emailChangerHandler = (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      dispatcher({ type: "emailError", payload: "email cannot be empty" });
    } else if (!e.target.value.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
      dispatcher({ type: "emailError", payload: "invalid email" });
    } else {
      dispatcher({ type: "emailIsValid" });
    }
  };

  const roleChangeHandler = (e) => {
    setRole(e.target.value);
    if (e.target.value === "") {
      dispatcher({ type: "roleError", payload: "role cannot be empty" });
    } else if (!(e.target.value === "admin" || e.target.value === "member")) {
      dispatcher({
        type: "roleError",
        payload: "role has to be either 'admin' or 'member'",
      });
    } else {
      dispatcher({ type: "roleIsValid" });
    }
  };

  const selectMemberHandler = () => {
    if (selectMember.current.checked) onSelectMember(memberId);
    else onDeSelectMember(memberId);
  };

  const saveMemberHandler = () => {
    if (
      formState.name.isValid &&
      formState.email.isValid &&
      formState.role.isValid
    ) {
      let memberData = {
        name,
        id: memberId,
        email,
        role,
      };
      dispatch(membersActions.editMember(memberData));
      setEditActive(false);
    }
  };

  const cancelEditHandler = () => {
    setName(memberName);
    setEmail(memberEmail);
    setRole(memberRole);
    setEditActive(false);
    dispatcher({ type: "resetFormState" });
  };

  return (
    <>
      <tr key={memberId}>
        <td>
          <input
            ref={selectMember}
            type="checkbox"
            onChange={selectMemberHandler}
            checked={isSelected}
          />
        </td>
        <td>
          {editActive ? (
            <>
              <input
                type="text"
                className={`${!formState.name.isValid ? "error" : ""}`}
                value={name}
                onChange={nameChangeHandler}
              />
              {!formState.name.isValid && (
                <div className="error-text">{formState.name.errMessage}</div>
              )}
            </>
          ) : (
            memberName
          )}
        </td>
        <td>
          {editActive ? (
            <>
              <input
                type="email"
                className={`${!formState.email.isValid ? "error" : ""}`}
                value={email}
                onChange={emailChangerHandler}
              />
              {!formState.email.isValid && (
                <div className="error-text">{formState.email.errMessage}</div>
              )}
            </>
          ) : (
            memberEmail
          )}
        </td>
        <td>
          {editActive ? (
            <>
              <input
                type="text"
                className={`${!formState.role.isValid ? "error" : ""}`}
                value={role}
                onChange={roleChangeHandler}
              />
              {!formState.role.isValid && (
                <div className="error-text">{formState.role.errMessage}</div>
              )}
            </>
          ) : (
            memberRole
          )}
        </td>
        <td style={{ textAlign: "right" }}>
          <div className={`${classes["icon-container"]}`}>
            {editActive ? (
              <>
                <FaSave
                  className={`${classes.icon} ${classes.edit}`}
                  onClick={saveMemberHandler}
                />
                <FaWindowClose
                  className={`${classes.icon} ${classes.delete}`}
                  onClick={cancelEditHandler}
                />
              </>
            ) : (
              <FaEdit
                className={`${classes.icon} ${classes.edit}`}
                onClick={editMemeberHanlder}
              />
            )}
            <FaTrash
              className={`${classes.icon} ${classes.delete}`}
              onClick={deleteMemberHandler}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default Member;

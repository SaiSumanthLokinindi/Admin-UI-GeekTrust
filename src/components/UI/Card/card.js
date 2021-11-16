import classes from "./card.module.css";

const Card = (props) => {
  return <div className={`${classes["card-div"]}`}>{props.children}</div>;
};

export default Card;

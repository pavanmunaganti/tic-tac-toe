import React from "react";

export default function Square(props) {
    return (
      <button className="square" onClick={() => props.onClick()}>
        <span className= {props.value === 'X'? 'player':'bot'}>{props.value}</span>
      </button>
    );
}
  
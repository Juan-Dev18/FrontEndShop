import React from 'react';

const Input = ({ type, value, onChange, min, max }) => (
    <input type={type} value={value} onChange={onChange} min={min} max={max}/>
);

export default Input;

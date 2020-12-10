import React from 'react';
import styles from './Input.module.scss';

const Input = ({ name, placeholder, onChange, title, value, type = "input", defaultValue }) => {
    return (
        <div className={styles.inputHead}>
            <label>{title}</label>
            <input
                className={styles.input}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                type={type}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default Input;

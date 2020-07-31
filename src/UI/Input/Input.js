import React from 'react';
import styles from './Input.module.scss';

const Input = ({ name, placeholder, onChange, title, value }) => {
    return (
        <div className={styles.inputHead}>
            <label>{title}</label>
            <input
                className={styles.input}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
            />
        </div>
    );
};

export default Input;

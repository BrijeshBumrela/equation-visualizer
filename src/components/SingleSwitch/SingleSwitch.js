import React from 'react';
import { Switch } from 'antd';
import styles from './SingleSwitch.module.scss';


const SingleSwitch = ({ name, onChange, label, defaultValue }) => {
    const handleChange = (changed) => {
        onChange(changed, name);
    }

    console.log(defaultValue)

    return (
        <div className={styles.wrapper}>
            <label>{label}</label>
            <Switch checked={defaultValue} onChange={handleChange}/>
        </div>
    )
};

export default SingleSwitch;

import React from 'react';
import Input from '../../UI/Input/Input';
import styles from './Equation.module.scss';
import { SettingOutlined } from '@ant-design/icons'

const Equation = ({ onEqnChange, name, showEqModal }) => {
    return (
        <div className={styles.eqnWrapper}>
            <div className={styles.header}>
                <h3>Write Your equation</h3>
                <span className={styles.iconWrapper} onClick={() => showEqModal(true, Number(name))}>
                    <SettingOutlined style={{ fontSize: '20px' }} />
                </span>
            </div>
            <Input onChange={(e) => onEqnChange(e, name)} name={name} title="Equation / Expression" placeholder="Enter Equation"/>
            <div id={`pretty-${name}`}>{"$$$$"}</div>
        </div>
    )
}

export default Equation;
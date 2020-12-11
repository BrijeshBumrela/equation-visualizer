import React from 'react';
import { parse } from 'mathjs';
import Input from '../../UI/Input/Input';
import styles from './Equation.module.scss';
import { SettingOutlined } from '@ant-design/icons'

const Equation = ({ onEqnChange, name, showEqModal, eqString, defaultValue }) => {
    const setString = (ref, eqString) => {
        console.log(eqString, ref, "KYA AY RE")
        try {
            if (ref & eqString) ref.textContent = "$$" + parse(eqString).toTex({ parenthesis: "keep" }) + "$$";
            window.MathJax && window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, ref]);
        } catch(e) {
            console.log('ayyo error')
        }
    }

    return (
        <div className={styles.eqnWrapper}>
            <div className={styles.header}>
                <h3>Write Your equation</h3>
                <span className={styles.iconWrapper} onClick={() => showEqModal(true, Number(name))}>
                    <SettingOutlined style={{ fontSize: '20px' }} />
                </span>
            </div>
            <Input defaultValue={defaultValue} onChange={(e) => onEqnChange(e, name)} name={name} title="Equation / Expression" placeholder="Enter Equation"/>
            <div ref={ref => setString(ref, eqString)} id={`pretty-${name}`}>{"$$$$"}</div>
        </div>
    )
}

export default Equation;
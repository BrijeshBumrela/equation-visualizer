import React from 'react';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from './Nav.module.scss';

const Nav = ({ onClick, onGenerate, onFileUpload }) => (
    <ul className={styles.header}>
        <li>
            <h1>Equation Visualizer</h1>
        </li>
        <li>
            <ul className={styles.navRightBtn}>
                <li><Button onClick={onClick} text="Graph Settings"></Button></li>
                <li><Button onClick={onGenerate} text="Generate JSON"></Button></li>
                <li><Input onChange={onFileUpload} type="file" text="Upload Image"></Input></li>
            </ul>
        </li>
    </ul>
)

export default Nav;
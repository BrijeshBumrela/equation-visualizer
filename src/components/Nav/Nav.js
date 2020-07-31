import React from 'react';
import Button from '../../UI/Button/Button';
import styles from './Nav.module.scss';

const Nav = ({ onClick }) => (
    <ul className={styles.header}>
        <li>
            <h1>Equation Visualizer</h1>
        </li>
        <li><Button onClick={onClick} text="Graph Settings"></Button></li>
    </ul>
)

export default Nav;
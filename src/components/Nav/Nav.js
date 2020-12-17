import React from "react";
import Button from "../../UI/Button/Button";
import styles from "./Nav.module.scss";

const Nav = ({ onClick, onGenerate, onFileUpload, history }) => {

    return (
        <ul className={styles.header}>
            <li>
                <h1>Equation Visualizer</h1>
            </li>
            <li>
                <ul className={styles.navRightBtn}>
                    <li>
                        <Button
                            onClick={onClick}
                            text="Graph Settings"
                        ></Button>
                    </li>
                    <li>
                        <Button
                            onClick={onGenerate}
                            text="Generate JSON"
                        ></Button>
                    </li>
                    {/* <li><Input onChange={onFileUpload} type="file" text="Upload Image"></Input></li> */}
                    <li>
                        <a href="http://localhost:8000" target="_newtab">Upload</a>
                    </li>
                </ul>
            </li>
        </ul>
    );
};

export default Nav;

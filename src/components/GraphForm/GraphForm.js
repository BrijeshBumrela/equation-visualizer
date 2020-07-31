import React, { useState } from 'react';
import Input from '../../UI/Input/Input';
import styles from './GraphForm.module.scss';
import updateGraph from '../../utils/Graph/graph';
import Button from '../../UI/Button/Button';
import SingleSwitch from '../SingleSwitch/SingleSwitch';


const initialState = {
    title: '',
    width: 800,
    height: 800,
    xAxis: {
        label: ''
    },
    yAxis: {
        label: ''
    },
    grid: false,
    tip: {
        xLine: false,
        yLine: false
    }
}

const GraphForm = ({ onValueChange, updateModal }) => {
    const [graphSettings, setGraphSettings] = useState(initialState);

    const handleChange = (e) => {
        const newGraphSettings = updateGraph(graphSettings, e.target.name, e.target.value);
        setGraphSettings(newGraphSettings)
    }

    const submitChange = () => {
        onValueChange(graphSettings);
        updateModal(false);
    }

    const handleToggle = (checked, name) => {
        const newGraphSettings = updateGraph(graphSettings, name, checked);
        setGraphSettings(newGraphSettings)
    }

    return (
        <>
            <Input
                onChange={handleChange}
                name="title"
                title="Title"
                placeholder="Enter Title"
            />
            <Input
                onChange={handleChange}
                name="width"
                title="Width"
                placeholder="Enter Width"
            />
            <Input
                onChange={handleChange}
                name="height"
                title="Height"
                placeholder="Enter Height"
            />
            <Input
                onChange={handleChange}
                name="xAxis"
                title="X-Axis Label"
                placeholder="Enter Label for X axis"
            />
            <Input
                onChange={handleChange}
                name="yAxis"
                title="Y-Axis Label"
                placeholder="Enter Label for Y axis"
            />
            <div className={styles.grid}>
               <SingleSwitch name="grid" onChange={handleToggle} label="Grid"/>
            </div>
            <div className={styles.tip}>
                <SingleSwitch name="xLine" onChange={handleToggle} label="X Line"/>
                <SingleSwitch name="yLine" onChange={handleToggle} label="Y Line"/>
            </div>
            <div className={styles.buttons}>
                <Button text="Save" onClick={submitChange}></Button>
                <Button text="Cancel" onClick={() => updateModal(false)}></Button>
            </div>
        </>
    );
};

export default GraphForm;

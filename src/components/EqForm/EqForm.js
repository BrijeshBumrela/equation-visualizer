import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input/Input';
import styles from './EqForm.module.scss';
import Button from '../../UI/Button/Button';
import SingleSwitch from '../SingleSwitch/SingleSwitch';
import { SketchPicker } from 'react-color';

const EqForm = ({ onValueChange, updateModal, index, initialData, handleColorChange }) => {
    const [eqSettings, setEqSettings] = useState(initialData);

    useEffect(() => {
        setEqSettings(initialData)
    }, [initialData, index]);

    const handleChange = (e) => {
        const prop = e.target.name;
        const value = e.target.value;

        const newEqnSettings = { ...eqSettings }
        newEqnSettings[prop] = value;
        setEqSettings(newEqnSettings)
    }

    const submitChange = () => {
        onValueChange(eqSettings, index);
        updateModal(false);
    }

    const handleToggle = (checked, name) => {
        const newEqnSettings = { ...eqSettings }
        newEqnSettings[name] = checked;
        setEqSettings(newEqnSettings)
    }

    const handleColorChangeHelper = (color) => {
        handleColorChange(color, index);
    }

    return (
        <>
            <Input
                onChange={handleChange}
                name="color"
                title="Color of the equation"
                placeholder="Color of the equation"
                value={(eqSettings && eqSettings.color) || ''}
            />
            
            <SketchPicker 
                color={(eqSettings && eqSettings.color) || '#000'}
                onChangeComplete={handleColorChangeHelper}    
            />
            
            
            <div className={styles.tip}>
                <SingleSwitch defaultValue={(eqSettings && eqSettings.isDerivative) || false} name="isDerivative" onChange={handleToggle} label="Show Derivative tangent"/>
            </div>
            <div className={styles.tip}>
                <SingleSwitch defaultValue={(eqSettings && eqSettings.closed) || false} name="closed" onChange={handleToggle} label="Show Closed graph"/>
                <SingleSwitch defaultValue={(eqSettings && eqSettings.skiptip) || false} name="skiptip" onChange={handleToggle} label="Tip pointer"/>
            </div>
            <div className={styles.buttons}>
                <Button text="Save" onClick={submitChange}></Button>
                <Button text="Cancel" onClick={() => updateModal(false)}></Button>
            </div>
        </>
    );
};

export default EqForm;

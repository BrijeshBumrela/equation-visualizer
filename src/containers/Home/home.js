import React, { useState, useEffect, useCallback } from 'react';
import Equation from '../../components/Equation/Equation';
import Button from '../../UI/Button/Button';
import styles from './home.module.scss';
import d3 from 'd3';
import functionPlot from 'function-plot';
import graphConfig from '../../config/graph';
import { Modal } from 'antd';
import Nav from '../../components/Nav/Nav';
import GraphForm from '../../components/GraphForm/GraphForm';
import EqForm from '../../components/EqForm/EqForm';
import { parse, derivative } from 'mathjs';
import fileDownload from 'js-file-download';
import imageUploadService from '../../services/imageEqns';

window.d3 = d3;

const fileUpload = imageUploadService(8000)

const fileUploadDummy = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res({ data: { eqString: "x^2 + 1" } })
        }, 1500);
    })
}

/** 
 * @param eqString {string} - equation string (like 'x^2 + y^2')
 * @param variables {array of single chars} - variables used in the eqString
 * @param result {number} - result computed when the values for variables are filled
 * @param fnType {'implicit' | 'explicit'}
 * 
*/
const equState = (obj) => {
    let eqString = '', color = 'red';

    if (obj && obj.eqString) {
        eqString = obj.eqString;
    }

    if (obj && obj.color) {
        color = obj.color;
    }

    return {
        eqString,
        closed: false,
        skiptip: false,
        color,
        isDerivative: false,
    }
}

const initialGraph = graphConfig();

const Home = () => {
    const [equations, setEquation] = useState([equState()])
    const [graph, setGraph] = useState(initialGraph)
    const [graphModalVisible, setGraphModalVisible] = useState(false)
    const [eqModalVisible, setEqModalVisible] = useState({ status: false, index: null })

    const showModal = () => setGraphModalVisible(true)

    const setEqModal = (status, index) => {
        status ? setEqModalVisible({ status, index }) : setEqModalVisible({ status, index: null })
    }

    const setModal = status => setGraphModalVisible(status);

    useEffect(() => {
        const script1 = document.createElement('script');
        const script2 = document.createElement('script');
        
        script2.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.3/MathJax.js?config=TeX-AMS-MML_HTMLorMML.js"

        script1.async = false;
        script2.async = false;

        document.body.appendChild(script1);
        document.body.appendChild(script2);

    }, []);

    const updateEquations = useCallback(() => {
        return equations.filter(equation => equation.eqString.length > 0).map(equation => {
            const fn = equation.processedEqn || equation.eqString;
            let derivativeObj;

            const finalObject = { fn, ...equation }

            if (equation.isDerivative) {
                try {
                    derivativeObj = {
                        fn: derivative(equation.eqString, 'x').toString(),
                        updateOnMouseMove: true
                    }
                    finalObject.derivative = derivativeObj;
                } catch(e) {
                    console.error("ERROR ALA RE", e);
                }
            }
            if (equation.isImplicit) {
                finalObject.fnType = 'implicit';
            }
            return finalObject
        })
    }, [equations])

    useEffect(() => {
        const result = updateEquations();
        console.log(result);
        try {
            functionPlot({
                target: "#target",
                data:  result,
                ...graph,
            });
        } catch(e) {
            console.log(e);
        }
    }, [equations, graph, updateEquations]);

    const addEquation = (eqns) => {
        const newEqnObjects = eqns.map(eqn => {
            return {
                ...equState({ eqString: eqn })
            }
        })
        setEquation(equations => [...equations, ...newEqnObjects])
    }

    const onEqnChange = (e, index = 0) => {
        index = Number(index);
        const value = e.target.value;

        let equationString = value;
        let processedEqn;

        const selectedEqn = { ...equations[index] }
        const otherEqns = [ ...equations ]

        /**
         * Equation is considered `implicit` as soon as it encounters `=` in equation
        */

        if (equationString.includes('=')) {
            const [LHS, RHS] = equationString.split("=");
            if (RHS.trim().length > 0) {
                selectedEqn.isImplicit = true;
                processedEqn = `(${RHS}) - (${LHS})`
                
                selectedEqn.processedEqn = processedEqn
            }
        }

        if (!selectedEqn.isImplicit) {
            selectedEqn.processedEqn = undefined;
        }

        selectedEqn.eqString = equationString;

        let latexEquation;
        try {
            const parsedEquation = parseEquation(processedEqn || equationString);
            latexEquation = parsedEquation.toTex({ parenthesis: 'keep' })
        } catch(e) {
            latexEquation = undefined
        }

        otherEqns[index] = selectedEqn;

        setLatexString(latexEquation, index);
        setEquation(otherEqns)

    }

    const setLatexString = (value, index) => {
        const elem = window.MathJax.Hub.getAllJax(`pretty-${index}`)[0];
        try {
            window.MathJax.Hub.Queue(["Text", elem, value]);
        } catch(e) {
            return;
        } 
    }

    const parseEquation = (value) => {
        try {
            return parse(value);
        } catch(e) {
            return ""
        }
    }

    const handleValueChange = (newGraphSettings) => {
        const newSettings = { ...graph, ...newGraphSettings }
        setGraph(newSettings);
    }

    const handleEqValueChange = (newEquationSettings, index) => {
        let selectedEqn = { ...equations[index] }
        const allEqns = [ ...equations ]

        selectedEqn = { ...selectedEqn, ...newEquationSettings };
        
        allEqns[index] = selectedEqn;
        setEquation(allEqns);
    }

    const handleJsonGenerate = () => {
        const equations = updateEquations();

        const { tip, ...rest } = graph;

        fileDownload(JSON.stringify({ 
            data: equations, 
            ...rest
        }, null, 4), 'value.json');
    }

    const onFileUpload = async (e) => {
        const file = e.target.files[0];
        console.log('ha')
        // const res = await fileUploadDummy();
        try {
            const res = await fileUpload(file);
            console.log(res);
            addEquation([res.data.eqString]);
        } catch(e) {
            console.error(e);
        }
    }

    return (
        <>
            <Nav onClick={showModal} onFileUpload={onFileUpload} onGenerate={handleJsonGenerate}/>

            <div className={styles.homeWrapper}>
                <Modal 
                    mask={true} 
                    title="Graph Settings" 
                    visible={graphModalVisible} 
                    footer={null}
                    onCancel={() => setModal(false)}
                >
                    <GraphForm updateModal={setModal} onValueChange={handleValueChange}/>
                </Modal>

                <Modal 
                    mask={true} 
                    title="Graph Settings" 
                    visible={eqModalVisible.status}
                    footer={null}
                    onCancel={() => setEqModal(false)}
                >
                    <EqForm 
                        initialData={equations[eqModalVisible.index]} 
                        index={eqModalVisible.index} 
                        updateModal={setEqModal} 
                        onValueChange={handleEqValueChange}
                    />

                </Modal>
                <div className={styles.leftSide}>
                    <div>
                        {equations.map((equation, index) => <Equation eqString={equation.eqString} showEqModal={setEqModal} name={index} onEqnChange={onEqnChange} key={index}/>)}
                    </div>
                    <div>
                        <Button onClick={() => addEquation([""])} text="Add Equation"></Button>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div id="target" className="map-div"></div>
                </div>
            </div>
        </>
    )
}

export default Home;
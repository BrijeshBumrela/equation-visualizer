import React, { useState, useEffect, useRef } from 'react';
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

window.d3 = d3;

/** 
 * @param eqString {string} - equation string (like 'x^2 + y^2')
 * @param variables {array of single chars} - variables used in the eqString
 * @param result {number} - result computed when the values for variables are filled
 * @param fnType {'implicit' | 'explicit'}
 * 
*/
const equState = {
    eqString: '',
    closed: false,
    skiptip: false,
    color: 'red',
    isDerivative: false,
}

const initialGraph = graphConfig();

const Home = () => {
    const [equations, setEquation] = useState([equState])
    const [graph, setGraph] = useState(initialGraph)
    const [graphModalVisible, setGraphModalVisible] = useState(false)
    const [eqModalVisible, setEqModalVisible] = useState({ status: false, index: null })

    const showModal = () => setGraphModalVisible(true)

    const setEqModal = (status, index) => {
        status ? setEqModalVisible({ status, index }) : setEqModalVisible({ status, index: null })
    }

    const setModal = status => setGraphModalVisible(status);

    const equationsCountRef = useRef();

    useEffect(() => {
        const script1 = document.createElement('script');
        const script2 = document.createElement('script');
        
        script2.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.3/MathJax.js?config=TeX-AMS-MML_HTMLorMML.js"

        script1.async = false;
        script2.async = false;

        document.body.appendChild(script1);
        document.body.appendChild(script2);

    }, []);


    const initializeLatexString = () => "$$" + parse('').toTex({ parenthesis: "keep" }) + "$$";

    useEffect(() => {
        if (equations.length > 1) {
            const newEquationDiv = document.querySelector(`#pretty-${equations.length - 1}`);
            newEquationDiv.textContent = initializeLatexString();
        }

        // * equationsCountRef keeps track of equations count till the previous render
        // * on re-rendering, checking if the new equation is getting added
        // * Do MathJax typeset only if new eq is added
        if (equationsCountRef.current !== equations.length) {
            const newEquationDiv = document.querySelector(`#pretty-${equations.length - 1}`);
            equationsCountRef.current = equations.length;
            window.MathJax && window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, newEquationDiv]);
        }

        const result = equations.filter(equation => equation.eqString.length > 0).map(equation => {
            const fn = equation.eqString;
            let temp = {}
            let derivativeObj;
            if (equation.isDerivative) {
                try {
                    derivativeObj = {
                        fn: derivative(equation.eqString, 'x').toString(),
                        updateOnMouseMove: true
                    }
                } catch(e) {}
            }
            if (equation.isImplicit) {
                temp.fnType = 'implicit';
            }
            return { fn, ...equation, derivative: derivativeObj, ...temp }
        })

        try {
            functionPlot({
                target: "#target",
                data: result,
                plugins: [functionPlot.plugins.zoomBox()],
                ...graph,
            });
        } catch(e) {
        }
    }, [equations, graph]);

    const addEquation = () => {
        setEquation(equations => [...equations, { ...equState }])
    }

    const onEqnChange = (e, index = 0) => {
        index = Number(index);
        const value = e.target.value;

        let equationString = value;

        const selectedEqn = { ...equations[index] }
        const otherEqns = equations.filter((_, idx) => idx !== Number(index))

        /**
         * Equation is considered `implicit` as soon as it encounters `=` in equation
         */
        selectedEqn.isImplicit = equationString.includes('=');
        if (selectedEqn.isImplicit) {
            const [LHS, RHS] = equationString.split("=");
            equationString = `(${RHS}) - (${LHS})`
        }

        const parsedEquation = parseEquation(equationString);
        selectedEqn.eqString = equationString;

        let latexEquation;
        try {
            latexEquation = parsedEquation.toTex({ parenthesis: 'keep' })
        } catch(e) {
            latexEquation = undefined
        }
        setLatexString(latexEquation, index);
        setEquation([...otherEqns, selectedEqn])
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
        console.log("INDEXXUUU", index);
        let selectedEqn = { ...equations[index] }
        const otherEqns = equations.filter((_, idx) => idx !== index);

        selectedEqn = { ...selectedEqn, ...newEquationSettings };
        
        const updatedEqns = [...otherEqns, selectedEqn];
        setEquation(updatedEqns);
    }

    return (
        <>
            <Nav onClick={showModal}/>

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
                        {equations.map((equation, index) => <Equation showEqModal={setEqModal} name={index} onEqnChange={onEqnChange} key={index}/>)}
                    </div>
                    <div>
                        <Button onClick={addEquation} text="Add Equation"></Button>
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
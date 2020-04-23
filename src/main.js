import "bulma/css/bulma.min.css";
import "./style.css";

import { implicitEnum, parenthesisEnum } from "./constants";
import { expr, pretty, result, varDOMNode, dynamicDOMNode } from "./selectors";

const parenthesis = parenthesisEnum["KEEP"];
const implicit = implicitEnum["HIDE"];

// initialize with an example expression
expr.value = "";
pretty.innerHTML = "$$" + math.parse(expr.value).toTex({ parenthesis }) + "$$";

expr.oninput = function() {
  let nodeParser = null;
  let equation = expr.value;
  let fnType = undefined;

  const variables = equation.match(/[xyz]/gi);
  const isEqualSignPresent = /=/gi.test(equation);

  updateVariables(variables || [], varDOMNode);
  if (!variables) {
    result.innerHTML = "";
    return;
  }

  if (isEqualSignPresent) {
    const [lhs, rhs] = equation.split("=").map(eq => eq.trim());
    if (!rhs) return;
    equation = `(${rhs}) - (${lhs})`;
    fnType = "implicit";
  }
  const varNodes = Array.from(varDOMNode.children);
  isEqualSignPresent ? disableVariables(varNodes) : enableVariables(varNodes);

  try {
    // parse the expression
    nodeParser = math.parse(equation);

    // evaluate the result of the expression
    result.innerHTML = isEqualSignPresent
      ? ""
      : math.format(nodeParser.compile().evaluate(getAllVariableValues()));
  } catch (err) {
    result.innerHTML =
      '<span style="color: red;">' + err.toString() + "</span>";
  }

  try {
    // export the expression to LaTeX
    const latex = nodeParser ? nodeParser.toTex({ parenthesis, implicit }) : "";

    // display and re-render the expression
    const elem = MathJax.Hub.getAllJax("pretty")[0];
    MathJax.Hub.Queue(["Text", elem, latex]);
    const eqObj = { fn: equation };
    if (fnType) {
      eqObj.fnType = fnType;
    }

    // Draw the graph
    drawGraph(eqObj, "#target");
  } catch (err) {}
};

const getAllVariableValues = () => {
  const childNodes = Array.from(varDOMNode.children);
  return childNodes.reduce((acc, node) => {
    const char = node.childNodes[0].htmlFor;
    const value = node.childNodes[1].value;
    if (value) {
      acc[char] = value;
    }
    return acc;
  }, {});
};

const enableVariables = nodes => {
  nodes.forEach(node => (node.childNodes[1].disabled = false));
};

const disableVariables = nodes => {
  nodes.forEach(node => (node.childNodes[1].disabled = true));
};

const createVarNode = variable => {
  if (variable !== "x" && variable !== "y") return null;

  const td = document.createElement("td");

  const label = document.createElement("label");
  label.htmlFor = variable;
  label.textContent = variable;
  label.className = "label";

  const input = document.createElement("input");
  input.type = "text";
  input.name = variable;
  input.id = `var-${variable}`;
  input.value = "";
  input.addEventListener("input", e => {
    expr.oninput();
  });
  input.classList.add("input");
  input.classList.add("input-variable");

  /* 
    <td>
      <label class="label">x</label>
      <input name="x" id="var-1" value="" type="text" />
    </td>
  */

  td.appendChild(label);
  td.appendChild(input);

  return td;
};

const updateVariables = (variables = [], domNode) => {
  // * When all variables are removed still you would like to call this function to remove 
  // * the node for the variable that was recently deleted
  
  // * adds a new node for new variable
  if (variables.length > 0) {
    variables.forEach(variable => {
      const varNode = dynamicDOMNode(variable);
      if (!varNode) {
        const newVarNode = createVarNode(variable);
        if (newVarNode) {
          domNode.appendChild(newVarNode);
        }
      }
    });
  }

  // * removes the node for deleted variable
  Array.from(domNode.children).forEach(child => {
    if (!variables.includes(child.innerText)) {
      domNode.removeChild(child);
    }
  });
};

/* 
  graph: {
    equation: <equation-string>,
    fnType: 'implicit'|'explicit'
  }
*/

const drawGraph = (eqObj, target) => {
  functionPlot({
    target,
    data: [eqObj],
    plugins: [functionPlot.plugins.zoomBox()],
    width: 800,
    height: 800
  });
};

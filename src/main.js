import { parenthesisEnum, implicitEnum } from './constants';

import { expr, pretty, result, varDOMNode, dynamicDOMNode } from './selectors';

const parenthesis = parenthesisEnum["KEEP"];
const implicit = implicitEnum["HIDE"];

// initialize with an example expression
expr.value = "";
pretty.innerHTML =
  "$$" + math.parse(expr.value).toTex({ parenthesis }) + "$$";

expr.oninput = function() {
  let nodeParser = null;

  const variables = expr.value.match(/[a-z]/gi);

  addVariables(variables, varDOMNode);

  try {
    // parse the expression
    nodeParser = math.parse(expr.value);

    // evaluate the result of the expression
    result.innerHTML = math.format(
      nodeParser.compile().evaluate(getAllVariableValues())
    );
  } catch (err) {
    result.innerHTML =
      '<span style="color: red;">' + err.toString() + "</span>";
  }

  try {
    // export the expression to LaTeX
    const latex = nodeParser
      ? nodeParser.toTex({ parenthesis , implicit })
      : "";

    // display and re-render the expression
    const elem = MathJax.Hub.getAllJax("pretty")[0];
    MathJax.Hub.Queue(["Text", elem, latex]);

    // Draw the graph
    drawGraph(expr.value, '#target');
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

const createVarNode = variable => {
  if (variable !== "x" && variable !== "y") return null;

  const td = document.createElement("td");
  const label = document.createElement("label");
  label.htmlFor = variable;
  label.textContent = variable;

  const input = document.createElement("input");
  input.type = "text";
  input.name = variable;
  input.id = `var-${variable}`;
  input.value = "";
  input.addEventListener("input", e => {
    expr.oninput();
  });

  td.appendChild(label);
  td.appendChild(input);

  return td;
};

const addVariables = (variables, domNode) => {
  variables.forEach(variable => {
    const varNode = dynamicDOMNode(variable);
    if (!varNode) {
      const newVarNode = createVarNode(variable);
      if (newVarNode) {
        domNode.appendChild(newVarNode);
      }
    }
  });
};

const drawGraph = (eqString, target) => {
  functionPlot({
    target,
    data: [
      {
        fn: eqString
      }
    ]
  });
};
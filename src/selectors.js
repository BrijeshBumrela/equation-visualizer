const expr = document.getElementById("expr");
const pretty = document.getElementById("pretty");
const result = document.getElementById("result");

// Wrapper div for list of variables td's 
const varDOMNode = document.querySelector(".variable");

const dynamicDOMNode = (count) => document.querySelector(`#var-${count}`);
export {
    expr,
    pretty,
    result,
    varDOMNode,
    dynamicDOMNode
}
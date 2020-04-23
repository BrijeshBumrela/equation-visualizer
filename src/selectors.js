const expr = document.getElementById("expr");
const pretty = document.getElementById("pretty");
const result = document.getElementById("result");

// Wrapper div for list of variables td's 
const varDOMNodes = document.querySelector(".variables");

const dynamicDOMNode = (count) => document.querySelector(`#var-${count}`);
export {
    expr,
    pretty,
    result,
    varDOMNodes,
    dynamicDOMNode
}
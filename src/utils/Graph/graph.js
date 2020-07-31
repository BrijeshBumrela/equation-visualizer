const updateGraph = (graphObj, prop, value) => {
    const graph = { ...graphObj }
    
    switch(prop) {
        case 'xAxis':
        case 'yAxis':
            /** 
             * @description this expects `value` to be an string consisting
             * `label` = string to be represented at the axis
            */
            graph[prop].label = value;
            break;

        case 'annotations':
            /** 
             * @description this expects `value` to be an object consisting
             * `x` | `y` = int
             * `text` = string
             * `index` = int (used to decide if a new or updated annotation)
            */

            const filteredAnnotations = graphObj.annotations.filter((_, index) => index !== value.index);
            let selected = graphObj.annotations[value.index]
            const { index, ...rest } = value;
            selected = rest;
            graph[prop] = [...filteredAnnotations, selected]
            break;

        case 'xLine':
        case 'yLine':
            /** 
             * @description this expects `value` to be an boolean consisting
             * `xLine` = boolean
             * `yLine` = boolean
             * ! For Now keep `renderer` undefined
             * `renderer` = undefined 
            */

            graph['tip'][prop] = value
            break;

        default:
            /**
             * `value` is a single primary datatype
             */
            graph[prop] = value;
    }

    return graph;
}

export default updateGraph;
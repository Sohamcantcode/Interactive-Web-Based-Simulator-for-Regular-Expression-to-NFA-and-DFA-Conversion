import { toPostfix } from './modules/regexParser.js';
import { buildNFA } from './modules/thompson.js';
import { buildDFA } from './modules/subset.js';
import { drawAutomaton } from './modules/visualizer.js';

let currentNFA = null;
let currentDFA = null;
let cyGraph = null;



function highlightEdgeByNodes(fromID, toID) {

    // reset all edges
    cyGraph.edges().style({
        'line-color': '#bbb',
        'target-arrow-color': '#bbb',
        'width': 2
    });


    cyGraph.edges(`[source = "${fromID}"][target = "${toID}"]`).style({
        'line-color': 'green',
        'target-arrow-color': 'green',
        'width': 6
    });

}




function highlightState(stateID) {

    cyGraph.nodes().style('background-color', '#66b2ff');

    cyGraph.$(`#${stateID}`).style({
        'background-color': 'red'
    });
}




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




window.simulate = async function () {

    if (!currentDFA || !cyGraph) return;

    const input = document.getElementById("testString").value;

    let currentState = currentDFA.start;

    // start at first node
    let currentNode = cyGraph.nodes()[0];

    highlightState(currentNode.id());

    for (let char of input) {

        await sleep(800);

        let transition = currentDFA.transitions.find(t =>
            JSON.stringify(t.from) === JSON.stringify(currentState) &&
            t.symbol === char
        );

        if (!transition) {
            alert("Rejected ❌");
            return;
        }

        let nextState = transition.to;

        // find edge from current node with correct symbol
        let edge = cyGraph.edges().filter(e =>
            e.data('source') === currentNode.id() &&
            e.data('label') === char
        );

        if (edge.length === 0) {
            alert("Rejected ❌");
            return;
        }

        let nextNodeID = edge[0].data('target');

        highlightEdgeByNodes(currentNode.id(), nextNodeID);

        await sleep(400);

        highlightState(nextNodeID);

        currentNode = cyGraph.$(`#${nextNodeID}`);
        currentState = nextState;
    }

    let isAccept = currentDFA.accept.some(a =>
        JSON.stringify(a) === JSON.stringify(currentState)
    );

    if (isAccept) {
        alert("Accepted ✅");
    } else {
        alert("Rejected ❌");
    }
};


/* ---------- REGEX CONVERSION ---------- */

window.convertRegex = function () {

    const regex = document.getElementById("regexInput").value;

    const postfix = toPostfix(regex);

    currentNFA = buildNFA(postfix);
    currentDFA = buildDFA(currentNFA);

    cyGraph = drawAutomaton(currentNFA);

    document.getElementById("output").textContent =
        "Regex: " + regex + "\n\n" +
        "Postfix: " + postfix + "\n\n" +
        "NFA Transitions: " + currentNFA.transitions.length + "\n" +
        "DFA States: " + currentDFA.states.length;
};


/* ---------- VIEW SWITCH ---------- */

window.showNFA = function () {
    if (currentNFA) cyGraph = drawAutomaton(currentNFA);
};

window.showDFA = function () {
    if (currentDFA) cyGraph = drawAutomaton(currentDFA);
};
export function drawAutomaton(automaton) {

    let elements = [];
    let states = new Map();
    let stateIndex = 0;

    function getStateName(state) {

        let key = JSON.stringify(state);

        if (!states.has(key)) {
            states.set(key, "q" + stateIndex++);
        }

        return states.get(key);
    }


    automaton.transitions.forEach(t => {

        let fromName = getStateName(t.from);
        let toName = getStateName(t.to);

        elements.push({
            data: {
                id: fromName,
                label: fromName
            }
        });

        elements.push({
            data: {
                id: toName,
                label: toName
            }
        });

    });


    automaton.transitions.forEach(t => {

        elements.push({
            data: {
                source: getStateName(t.from),
                target: getStateName(t.to),
                label: t.symbol
            }
        });

    });

    let cy = cytoscape({

        container: document.getElementById('graph'),

        elements: elements,

        style: [

            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': '#66b2ff',
                    'width': 40,
                    'height': 40,
                    'border-width': 2,
                    'border-color': '#333'
                }
            },

            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'label': 'data(label)',
                    'font-size': 12,
                    'line-color': '#bbb',
                    'target-arrow-color': '#bbb',
                    'width': 2,

                    /* important for animation */
                    'transition-property': 'line-color, target-arrow-color, width',
                    'transition-duration': '0.2s'
                }
            }

        ],

        layout: {
            name: 'breadthfirst',
            directed: true,
            padding: 10,
            spacingFactor: 1.5
        }

    });

    if (automaton.start) {

        let startName = getStateName(automaton.start);

        cy.$(`#${startName}`).style({
            'background-color': '#7CFC00'
        });

    }

    if (automaton.accept) {

        automaton.accept.forEach(s => {

            let name = getStateName(s);

            cy.$(`#${name}`).style({
                'border-width': 5,
                'border-color': 'black'
            });

        });
    }

    return cy;
}
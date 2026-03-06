export function buildNFA(postfix) {

    let stateCount = 0;
    const stack = [];

    function newState() {
        return stateCount++;
    }

    function createFragment(symbol) {

        let start = newState();
        let accept = newState();

        return {
            start,
            accept,
            transitions: [
                { from: start, to: accept, symbol }
            ]
        };
    }

    for (let char of postfix) {

        // SYMBOL
        if (/[a-z]/.test(char)) {
            stack.push(createFragment(char));
        }

        // CONCATENATION
        else if (char === '.') {

            let frag2 = stack.pop();
            let frag1 = stack.pop();

            frag1.transitions.push({
                from: frag1.accept,
                to: frag2.start,
                symbol: 'ε'
            });

            stack.push({
                start: frag1.start,
                accept: frag2.accept,
                transitions: [
                    ...frag1.transitions,
                    ...frag2.transitions
                ]
            });
        }

        // UNION
        else if (char === '|') {

            let frag2 = stack.pop();
            let frag1 = stack.pop();

            let start = newState();
            let accept = newState();

            let transitions = [

                { from: start, to: frag1.start, symbol: 'ε' },
                { from: start, to: frag2.start, symbol: 'ε' },

                ...frag1.transitions,
                ...frag2.transitions,

                { from: frag1.accept, to: accept, symbol: 'ε' },
                { from: frag2.accept, to: accept, symbol: 'ε' }
            ];

            stack.push({
                start,
                accept,
                transitions
            });
        }

        // KLEENE STAR
        else if (char === '*') {

            let frag = stack.pop();

            let start = newState();
            let accept = newState();

            let transitions = [

                { from: start, to: frag.start, symbol: 'ε' },
                { from: start, to: accept, symbol: 'ε' },

                ...frag.transitions,

                { from: frag.accept, to: frag.start, symbol: 'ε' },
                { from: frag.accept, to: accept, symbol: 'ε' }
            ];

            stack.push({
                start,
                accept,
                transitions
            });
        }
    }

    return stack.pop();
}
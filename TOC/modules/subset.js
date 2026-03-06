export function buildDFA(nfa) {

    const alphabet = new Set();


    for (let t of nfa.transitions) {
        if (t.symbol !== 'ε') {
            alphabet.add(t.symbol);
        }
    }

    function epsilonClosure(states) {

        let stack = [...states];
        let closure = new Set(states);

        while (stack.length) {

            let state = stack.pop();

            for (let t of nfa.transitions) {

                if (t.from === state && t.symbol === 'ε') {

                    if (!closure.has(t.to)) {
                        closure.add(t.to);
                        stack.push(t.to);
                    }
                }
            }
        }

        return closure;
    }

    function move(states, symbol) {

        let result = new Set();

        for (let s of states) {

            for (let t of nfa.transitions) {

                if (t.from === s && t.symbol === symbol) {
                    result.add(t.to);
                }
            }
        }

        return result;
    }

    let startClosure = epsilonClosure([nfa.start]);

    let dfaStates = [];
    let dfaTransitions = [];
    let unmarked = [];

    dfaStates.push(startClosure);
    unmarked.push(startClosure);

    while (unmarked.length) {

        let current = unmarked.pop();

        for (let symbol of alphabet) {

            let moved = move(current, symbol);
            let closure = epsilonClosure([...moved]);

            if (closure.size === 0) continue;

            let exists = dfaStates.some(s =>
                [...s].sort().join() === [...closure].sort().join()
            );

            if (!exists) {
                dfaStates.push(closure);
                unmarked.push(closure);
            }

            dfaTransitions.push({
                from: [...current],
                to: [...closure],
                symbol
            });
        }
    }

    let acceptStates = dfaStates.filter(set =>
        set.has(nfa.accept)
    );

    return {
        states: dfaStates.map(s => [...s]),
        transitions: dfaTransitions,
        start: [...startClosure],
        accept: acceptStates.map(s => [...s])
    };
}
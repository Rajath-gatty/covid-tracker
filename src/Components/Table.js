import React, { useState, useEffect } from 'react'
import numeral from 'numeral';

const Table = () => {
    const [states, setStates] = useState([]);

    useEffect(() => {
        const fetchStates = async () => {
            await fetch('https://api.covid19india.org/data.json')
                .then(res => res.json())
                .then(data => {
                    setStates(data.statewise);
                })
        }
        fetchStates();

    }, [])
    console.log(states)
    return (
        <div>
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>State</th>
                        <th>Total cases</th>
                        <th>Active cases</th>
                        <th>Recovered</th>
                        <th>Deaths</th>
                    </tr>
                </thead>
                <tbody>
                    {states.filter(state => (
                        state.state !== 'Total'
                    )).sort((a, b) => {
                        return a.confirmed > b.confirmed ? b - a : a - b
                    }).map((state, i) => {
                        return (
                            <tr key={i}>
                                <td>{state.state}</td>
                                <td>{numeral(state.confirmed).format("0,0")}</td>
                                <td>{numeral(state.active).format("0,0")}</td>
                                <td>{numeral(state.recovered).format("0,0")}</td>
                                <td>{numeral(state.deaths).format("0,0")}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
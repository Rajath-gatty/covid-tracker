import React from 'react'
import numeral from 'numeral';

const Table = ({ countries }) => {
    return (
        <div>
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Total cases</th>
                        <th>Active cases</th>
                        <th>Total tests</th>
                    </tr>
                </thead>
                <tbody>
                    {countries.sort((a, b) => {
                        if (a.cases > b.cases) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }).map((country, i) => {
                        return (
                            <tr key={i}>
                                <td>{country.country}</td>
                                <td>{numeral(country.cases).format("0,0")}</td>
                                <td>{numeral(country.active).format("0,0")}</td>
                                <td>{numeral(country.tests).format("0,0")}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
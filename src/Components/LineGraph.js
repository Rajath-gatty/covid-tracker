import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import Spinner from './UI/Spinner';


const LineGraph = ({ country, casesType, graphColor, background }) => {
    const [globalGraphData, setGlobalGraphData] = useState({});
    const [countryData, setCountryData] = useState({});

    const options = {

        elements: {
            point: {
                radius: 0
            },
        },
        maintainAspectRatio: true,
        tooltips: {
            mode: "index",
            intersect: false,
            callback: {
                label: function (tooltipItem, data) {
                    return numeral(tooltipItem.value).format("0,0");
                },
            },
        },
        scales: {
            xAxes: [
                {
                    type: "time",
                    time: {
                        parser: "MM/DD/YY",
                        tooltipFormat: "ll",
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            return numeral(value).format("0a");
                        },
                    },
                },
            ],
        },
    }

    const buildGlobalChartData = (chartData, casesType = "cases") => {
        let chart = [];
        let lastDataPoint;
        for (let date in chartData.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: chartData[casesType][date] - lastDataPoint
                }
                chart.push(newDataPoint)
            }
            lastDataPoint = chartData[casesType][date];
        }
        return chart;
    }

    const buildCountryChartData = (chartData, casesType = "cases") => {
        let chart = [];
        let lastDataPoint;
        for (let date in chartData.timeline.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: chartData.timeline[casesType][date] - lastDataPoint
                }
                chart.push(newDataPoint)
            }
            lastDataPoint = chartData.timeline[casesType][date];
        }
        return chart;
    }


    useEffect(() => {
        const fetchHistory = async () => {
            if (!country) {
                await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                    .then(res => res.json())
                    .then(data => {
                        const chartData = buildGlobalChartData(data, casesType);
                        setGlobalGraphData(chartData);
                    })
            } else {
                await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`)
                    .then(res => res.json())
                    .then(data => {
                        const countryChartData = buildCountryChartData(data, casesType);
                        setCountryData(countryChartData);
                    })
            }
        }
        fetchHistory();

    }, [country, casesType])


    return (
        <div className="graph">
            {countryData.length && country ?
                <Line data={{
                    datasets: [{
                        data: countryData,
                        label: `new ${casesType} in ${country}`,
                        borderColor: graphColor,
                        backgroundColor: background
                    }]
                }}
                    options={options} />
                : globalGraphData.length ?
                    <Line data={{
                        datasets: [{
                            data: globalGraphData,
                            label: `Worldwide new ${casesType}`,
                            borderColor: graphColor,
                            backgroundColor: background,
                            pointBorderColor: "rgba(255, 211, 50)"
                        }]
                    }}
                        options={options} /> : <Spinner />}

        </div>
    );
}

export default LineGraph;
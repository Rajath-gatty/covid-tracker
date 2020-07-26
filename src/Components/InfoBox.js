import React from 'react'
import numeral from 'numeral';
import Spinner from './UI/Spinner';

const InfoBox = ({ title, cases, today, casesType, subTitle, flag, updated, loading }) => {
    const classTitle = [`info-box ${casesType}`].join('')
    return (
        <div className={classTitle}>
            {!loading ?
                <div>
                    <div className="country-info">
                        <img src={flag} alt={subTitle} />
                        <h6>{subTitle}</h6>
                    </div>
                    <p className="info-title" >{title}</p>
                    <h2 className="info-cases">{numeral(cases).format("0,0")}</h2>
                    <h5 className="info-today">Today : {numeral(today).format("0,0")}</h5>
                    <h6>updated at : {new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(updated)}</h6> </div> : <Spinner />}
        </div >
    );
}

export default InfoBox;
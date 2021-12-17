import './History.css';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

function History() {

  const db = getFirestore();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const query = await getDocs(collection(db, 'history'));
      setHistory(query.docs.map(doc => {
        return doc.data();
      }));
    };
    fetchHistory();
  }, [db]);

  const historyTiles = () => {
    debugger;
    const sortedHistory = history.sort((a, b) => b.date - a.date);
    return sortedHistory.map((item, index) => {
      return (
        <div className='history-tile' key={`${index}${item.name}.history`}>
          <div className='history-spend'>
            <div>{item.name}</div>
            <div>{`${item.value} R$`}</div>
          </div>
          <div className='finance-card-footer'>
            <div className='finance-max'>{`Spend date: ${item.date.toDate().toLocaleString('pt-BR')}`}</div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className='history-tiles'>
      {historyTiles()}
    </div>
  );
}

export default History;

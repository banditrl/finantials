import './App.css';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc } from 'firebase/firestore/lite';
import { AiOutlineShopping, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'

function App() {

  const db = getFirestore();

  const [finances, setFinances] = useState([]);
  const [selectedFinance, setSelectedFinance] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [valueToSpend, setValueToSpend] = useState(0);

  useEffect(() => {
    const fetchFinances = async () => {
      const query = await getDocs(collection(db, 'finances'));
      setFinances(query.docs.map(doc => {
        const finance = doc.data();
        finance.ref = doc.ref;
        return finance;
      }));
    };
    fetchFinances();
  }, [db]); 

  const togglePopup = (finance) => {
    setShowPopup(!showPopup);
    setSelectedFinance(finance);
  }

  const handleValueToSpend = (event) => {
    setValueToSpend(event.target.value);
  }

  const spend = async () => {
    const newValue = selectedFinance.value - valueToSpend;
    await updateDoc(selectedFinance.ref, {
      value: newValue
    });
  }

  const financeCards = () => {
    return finances.map((finance, index) => {
      return (
        <div className="finance-card" key={`${index}${finance.name}`}>
          <div className="finance-name">{finance.name}</div>
          <div className="finance-value">
            <div>{`Available: R$ ${finance.value}`}</div>
            <div>{`Spent: R$ ${(finance.maxValue - finance.value).toFixed(2)}`}</div>
          </div>
          <div className="finance-card-footer">
            <div className="finance-max">{`Monthly expected value: R$ ${finance.maxValue}`}</div>
            <div className="action-icons">
              <div className="icon" onClick={() => togglePopup(finance)}><AiOutlineShopping /></div>
              <div className="icon" onClick={() => togglePopup(finance)}><AiOutlineEdit /></div>
              <div className="icon" onClick={() => togglePopup(finance)}><AiOutlineDelete /></div>
            </div>
          </div>
        </div>
      );
    });
  }

  const popUp = () => {
    return (
      <div className="modal-background">
        <div className="modal">
          <span className="close" onClick={togglePopup}>
            &times;
          </span>
          <div className="modal-content">
            <form className="spend-form" onSubmit={spend}>
              How much did you spent?
              <input className="input-text" type="text" value={valueToSpend} onChange={handleValueToSpend} />
              <input className="input-submit" type="submit" value="Spend" />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App App-header">
      {financeCards()}
      {showPopup ? popUp() : <div />}
    </div>
  );
}

export default App;

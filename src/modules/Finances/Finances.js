import './Finances.css';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, addDoc, Timestamp } from 'firebase/firestore/lite';
import { AiOutlineShopping, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'

function Finances() {

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

  const spend = () => {
    const newValue = selectedFinance.value - valueToSpend;

    addDoc(collection(db, 'history'), {
      name: selectedFinance.name,
      value: valueToSpend,
      date: Timestamp.fromDate(new Date())
    });

    updateDoc(selectedFinance.ref, {
      value: newValue
    });
  }

  const totalCard = () => {
    const totalValue = finances.reduce((reducer, finance) => reducer + finance.value, 0);
    const totalMaxValue = finances.reduce((reducer, finance) => reducer + finance.maxValue, 0);
    return (
      <div className='finance-card card-top-margin'>
        <div className='finance-name'>Totals</div>
        <div className='finance-card-total'>
          <div className='finance-max'>{`Total remaining: R$ ${totalValue.toFixed(2)}`}</div>
          <div className='finance-max'>{`Total configured: R$ ${totalMaxValue.toFixed(2)}`}</div>
        </div>
      </div>
    );
  }

  const financeCards = () => {
    return finances.map((finance, index) => {
      return (
        <div className='finance-card' key={`${index}${finance.name}.finance`}>
          <div className='finance-name'>{finance.name}</div>
          <div className='finance-value'>
            <div>{`Available: R$ ${finance.value.toFixed(2)}`}</div>
            <div>{`Spent: R$ ${(finance.maxValue - finance.value).toFixed(2)}`}</div>
          </div>
          <div className='finance-card-footer'>
            <div className='finance-max'>{`Monthly expected value: R$ ${finance.maxValue}`}</div>
            <div className='action-icons'>
              <div className='icon' onClick={() => togglePopup(finance)}><AiOutlineShopping /></div>
              <div className='icon' onClick={() => togglePopup(finance)}><AiOutlineEdit /></div>
              <div className='icon' onClick={() => togglePopup(finance)}><AiOutlineDelete /></div>
            </div>
          </div>
        </div>
      );
    });
  }

  const popUp = () => {
    return (
      <div className='modal-background'>
        <div className='modal'>
          <span className='close' onClick={togglePopup}>
            &times;
          </span>
          <div className='modal-content'>
            <form className='spend-form' onSubmit={spend}>
              How much did you spent?
              <input className='input-text' type='text' value={valueToSpend} onChange={handleValueToSpend} />
              <input className='input-submit' type='submit' value='Spend' />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='App App-header'>
      {totalCard()}
      {financeCards()}
      {showPopup ? popUp() : <div />}
    </div>
  );
}

export default Finances;

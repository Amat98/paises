import React, { useState } from 'react';
import './App.css';
import CountryList from './components/CountryList';

function App() {
  const [clickOpen, setClickOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleClickOpen = () => {
    setClickOpen(true);
  };

  const handleClickClose = () => {
    setClickOpen(false);
  };

  const handleOptionSelected = (option) => {
    setSelectedOption(option === selectedOption ? null : option);
  };

  return (
    <>
      <div className="btnOpenOptions" onClick={handleClickOpen}>
        <i className="bx bx-right-arrow-alt"></i>
      </div>
      <section className={clickOpen ? 'menuOptions' : 'menuOptions menuOptions__off'}>
        <div className="logo">LOGO</div>
        <ul>
          <li
            className={selectedOption === 'Home' ? 'li__selected' : 'li__notSelected'}
            onClick={() => handleOptionSelected('Home')}
          >
            Home
          </li>
          <li
            className={selectedOption === 'Vista 1' ? 'li__selected' : 'li__notSelected'}
            onClick={() => handleOptionSelected('Vista 1')}
          >
            Vista 1
          </li>
          <li
            className={selectedOption === 'Vista 2' ? 'li__selected' : 'li__notSelected'}
            onClick={() => handleOptionSelected('Vista 2')}
          >
            Vista 2
          </li>
        </ul>
        <div onClick={handleClickClose} className="btnCloseOptions">
          <i className="bx bx-left-arrow-alt"></i>
        </div>
      </section>
      {selectedOption === 'Home' && <CountryList />}
      {selectedOption === 'Vista 1' && <h1 className='vista'>Hola, estás en Vista 1</h1>}
      {selectedOption === 'Vista 2' && <h1 className='vista'>Hola, estás en Vista 2</h1>}
    </>
  );
}

export default App;
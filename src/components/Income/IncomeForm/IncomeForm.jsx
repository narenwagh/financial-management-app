import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../../utils/dateFormat';
import { addIncomeAction } from '../../../store/actions/incomeActions';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

import { firestore } from '../../../firebase';
import styles from './IncomeForm.module.css';
import CustomInput from '../../form/Input/CustomInput';
import Dropdown from '../../form/Dropdown/Dropdown';
import CustomButton from '../../form/Button/CustomButton';
import { useAuth } from '../../../contexts/AuthContext';

function IncomeForm() {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const totalAmount = useSelector((state) => state.incomes.totalAmount);
  const dispatch = useDispatch();
  const [incomeItem, setIncomeItem] = useState({
    amount: '',
    type: '',
    tax: '',
  });
  const [dropdownTaxError, setDropdownTaxError] = useState(false);
  const [dropdownTaxPlaceholder, setDropdownTaxPlaceholder] =
    useState('Is it taxable?');
  const [dropdownError, setDropdownError] = useState(false);
  const [dropdownPlaceholder, setDropdownPlaceholder] =
    useState('Type of Income');
  const [inputError, setInputError] = useState('');

  const optionsTax = [
    { value: 'Taxable', label: 'Taxable' },
    { value: 'After tax', label: 'After tax' },
  ];

  const optionsPay = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
  ];

  const handleAddIncome = useCallback(
    async (e) => {
      e.preventDefault();

      if (!incomeItem.amount) {
        setInputError('Enter the value');
        return;
      }

      if (!incomeItem.type) {
        setDropdownError(true);
        return;
      }

      if (!incomeItem.tax) {
        setDropdownError(true);
        return;
      }

      setLoading(true);

      const income = {
        amount: incomeItem.amount,
        type: incomeItem.type,
        tax: incomeItem.tax,
        date: formatDate(new Date()),
        id: Date.now(),
      };

      dispatch(addIncomeAction(income));

      await updateDoc(doc(firestore, 'users', currentUser?.uid), {
        incomes: arrayUnion(income),
        totalAmount: totalAmount + parseFloat(incomeItem.amount),
      });

      setIncomeItem({ amount: '', type: '' });
      setInputError('');
      setDropdownPlaceholder('Type of Income');
      setDropdownTaxPlaceholder('Is it taxable?');
      setLoading(false);
    },
    [
      currentUser?.uid,
      incomeItem.amount,
      incomeItem.type,
      incomeItem.tax,
      dispatch,
      totalAmount,
    ]
  );

  const handleDropdownChange = (option) => {
    setIncomeItem({ ...incomeItem, type: option.value });
    setDropdownError(false);
  };

  const handleTaxDropdownChange = (option) => {
    setIncomeItem({ ...incomeItem, tax: option.value });
    setDropdownTaxError(false);
  };

  const handleInputChange = (value) => {
    setIncomeItem({ ...incomeItem, amount: value });
    setInputError('');
  };

  const buttonTitle = loading ? 'Loading...' : 'Add income';

  return (
    <form onSubmit={handleAddIncome} className={styles.form}>
      <h2 className={styles.title}>Write down your income</h2>
      <div className={styles.inputs}>
        <CustomInput
          label="Amount"
          type="number"
          id="income"
          step="0.01"
          value={incomeItem.amount}
          error={inputError}
          required
          onChange={handleInputChange}
        />
        <Dropdown
          placeHolder={dropdownPlaceholder}
          setPlaceHolder={setDropdownPlaceholder}
          options={optionsPay}
          onChange={handleDropdownChange}
          error={dropdownError}
        />
        <Dropdown
          placeHolder={dropdownTaxPlaceholder}
          setPlaceHolder={setDropdownTaxPlaceholder}
          options={optionsTax}
          onChange={handleTaxDropdownChange}
          error={dropdownTaxError}
        />
        <CustomButton type="submit" title={buttonTitle} disabled={loading} />
      </div>
    </form>
  );
}

export default IncomeForm;

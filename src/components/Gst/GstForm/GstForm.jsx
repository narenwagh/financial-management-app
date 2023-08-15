import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTotalTaxLiabilityAction,
  setFilingStatusAction,
  setDeductionsAction,
} from "../../../store/actions/taxActions";
import { federalTaxRates, virginiaTaxRates } from "../../../data/taxRates";
import styles from "./TaxForm.module.css";
import CustomButton from "../../form/Button/CustomButton";
import Dropdown from "../../form/Dropdown/Dropdown";
import CustomInput from "../../form/Input/CustomInput";
import Radio from "../../form/Radio/Radio";
import { calculateTaxLiability } from "./gstCalculation";
import { firestore } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { formatDate } from "../../../utils/dateFormat";

function TaxForm() {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [useStandardDeduction, setUseStandardDeduction] = useState(false);
  const incomes = useSelector((state) => state.incomes.incomes);
  const { filingStatus, deductions } = useSelector((state) => state.taxes);
  const [dropdownError, setDropdownError] = useState(false);
  const [dropdownPlaceholder, setDropdownPlaceholder] = useState("18%");
  const dispatch = useDispatch();
  const [gstItem, setGstItem] = useState({
    type: "",
    amount: "",
    description: "",
    pay: "",
    date: new Date(),
    answer: "",
    percentage : 18,
  });
  const [inputError, setInputError] = useState("");
  const totalExpense = useSelector((state) => state.expenses.totalExpense);

  useEffect(() => {
    useStandardDeduction
      ? dispatch(setDeductionsAction(12500))
      : dispatch(setDeductionsAction(deductions));
  }, [useStandardDeduction, deductions, dispatch]);

  const incomeBeforeTax = incomes.reduce((accumulator, item) => {
    if (item.tax === "Taxable") {
      return accumulator + parseFloat(item.amount);
    } else {
      return accumulator;
    }
  }, 0);

  const handleDropdownChange = (option) => {
    setGstItem({ ...gstItem, percentage: option.value });
    setDropdownError(false);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!gstItem.amount) {
        setInputError("Enter the value");
        return;
      }

      if (gstItem.amount.length > 9) {
        setInputError("Enter the smaller number");
        return;
      }

      if (gstItem.amount < 0) {
        setInputError("Enter a positive value");
        return;
      }

      setLoading(true);

      let answer = Number(gstItem.amount)+ Number(gstItem.amount)/100 * gstItem.percentage;
      setGstItem({ ...gstItem, answer: answer });

      /*       const newGst = {
        amount: gstItem.amount,
        type: gstItem.type,
        pay: gstItem.pay,
        description: gstItem.description,
        date: formatDate(gstItem.date),
        id: Date.now(),
      }; */

      // dispatch(addExpenseAction(newGst));
      // const userDocRef = doc(firestore, 'users', currentUser?.uid);
      // const userDoc = await getDoc(userDocRef);
      // const money = userDoc.data().money;

      /* await updateDoc(userDocRef, {
          expenses: arrayUnion(newExpense),
          totalExpense: totalExpense + parseFloat(newExpense.amount),
          money: {
            totalCard: money.totalCard - parseFloat(newExpense.amount),
            totalCash: money.totalCash,
            totalSavings: money.totalSavings,
          },
      }); */

      /* setGstItem({
        amount: 0,
        type: "",
        description: "",
        pay: "",
        date: new Date(),
        answer: "",
        percentage : 18,
      }); */
      setLoading(false);
      setInputError("");
    },
    [
      currentUser?.uid,
      gstItem.amount,
      gstItem.type,
      gstItem.description,
      gstItem.pay,
      gstItem.date,
      gstItem.answer,
      dispatch,
      totalExpense,
    ]
  );

  const handleAmountChange = (value) => {
    setGstItem({ ...gstItem, amount: value });
    setInputError("");
  };

  const options = [
    { value: "5", label: "5%" },
    { value: "18", label: "18%" },
    { value: "12", label: "12%" },
    { value: "25", label: "25%" },
  ];

  const buttonTitle = loading ? "Loading..." : "Calculate";

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputs}>
      <h2 className={styles.title}>GST Calculator</h2>
        <br />
        <CustomInput
          label="Amount"
          type="number"
          id="expense"
          step="0.01"
          value={gstItem.amount}
          error={inputError}
          required
          onChange={handleAmountChange}
        />
        <br />
        <Dropdown
          placeHolder={dropdownPlaceholder}
          setPlaceHolder={setDropdownPlaceholder}
          options={options}
          selectedValue={gstItem.percentage}
          // value={gstItem.percentage}
          onChange={handleDropdownChange}
          error={dropdownError}
        />
        <br />
        Amount including GST : <span className={styles.tax}>{gstItem.answer}</span>
        <br />
        <br />
        <CustomButton type="submit" title={buttonTitle} disabled={loading} />
      </div>
    </form>
  );
}

export default TaxForm;

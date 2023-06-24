import React, { useEffect, useState } from 'react';
import styles from './ExpenseList.module.css';
import MoonLoader from 'react-spinners/MoonLoader';
import firebase from 'firebase/compat/app';
import {
  removeExpenseAction,
  updateExpenseAction,
} from '../../../store/actions/expenseActions';
import { firestore } from '../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import CustomButton from '../../form/Button/CustomButton';
import { formatNumber } from '../../../utils/formatNumber';

const ExpenseList = () => {
  const expenses = useSelector((state) => state.expenses.expenses || []);
  const dispatch = useDispatch();

  const currentUser = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.currentUser) {
      const fetchData = async () => {
        setLoading(true);
        const userId = currentUser.currentUser.uid;
        const userDocRef = firestore.collection('users').doc(userId);
        const userDoc = await userDocRef.get();
        const userData = userDoc.data();
        setLoading(false);
        dispatch(updateExpenseAction(userData?.expenses || []));
      };

      fetchData();
    }
  }, [currentUser, dispatch]);

  const deletePoint = async (expense) => {
    const userId = currentUser?.currentUser?.uid;

    await firestore
      .collection('users')
      .doc(userId)
      .update({
        expenses: firebase.firestore.FieldValue.arrayRemove(expense),
      });

    dispatch(removeExpenseAction(expense.id));
  };

  return (
    <ul className={styles.list}>
      {loading ? (
        <div className={styles.loading}>
          <MoonLoader color="#2e8b43" />
        </div>
      ) : (
        <>
          {expenses.length > 0 ? (
            <div className={styles.listWrapper}>
              {expenses.map((expense) => (
                <div key={expense.id} className={styles.item}>
                  <div className={styles.expense}>
                    -{formatNumber(expense.amount)} $
                  </div>
                  <span className={styles.description}>
                    {expense.description}
                  </span>
                  <div>{expense.type}</div>
                  <div>{expense.pay}</div>
                  <div>{expense.date}</div>
                  <CustomButton
                    type="submit"
                    title="Delete"
                    onClick={() => deletePoint(expense)}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>No expense yet...</div>
          )}
        </>
      )}
    </ul>
  );
};

export default ExpenseList;

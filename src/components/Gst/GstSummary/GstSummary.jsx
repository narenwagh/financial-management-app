import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./TaxSummary.module.css";
import { updateIncomeAction } from "../../../store/actions/incomeActions";
import { firestore } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import CustomInput from "../../form/Input/CustomInput";
import CustomButton from "../../form/Button/CustomButton";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import GstList from '../GstList/GstList';

function TaxSummary() {
  const incomes = useSelector((state) => state.incomes.incomes);
  const { stateTax, federalTax, totalTaxLiability } = useSelector(
    (state) => state.taxes
  );
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [inputError, setInputError] = useState("");
  const dispatch = useDispatch();

  const [feedback, setFeedback] = useState({
    userId: "",
    userName: "",
    email: "",
    message: "",
    date: "",
    messageId: "",
  });

  const handleEmailChange = (value) => {
    setFeedback({ ...feedback, email: value });
  };

  const handleMessageChange = (event) => {
    if (!event.target.value) {
      setInputError("Enter the value");
      return;
    }

    setFeedback({ ...feedback, message: event.target.value });
  };

  

  

  const currentUser = useAuth();

   useEffect(() => {
    if (currentUser?.currentUser) {
      const userId = currentUser.currentUser.uid;
      const userName = currentUser.currentUser.email;
      if(userName=='admin@gmail.com'){
        setShowResponse(true);
      }
    }
  }, [currentUser, dispatch]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!feedback.email) {
        setInputError("Enter the email");
        return;
      }

      if (!feedback.message) {
        setInputError("Enter the feedback message");
        return;
      }

      setLoading(true);
      const userId = currentUser.currentUser.uid;
      const userName = currentUser.currentUser.email;
      const newFeedback = {
        userId: userId,
        userName: userName,
        email: feedback.email,
        message: feedback.message,
        // date: new Date().toLocaleString(),
        date : Timestamp.fromDate(new Date()),
        messageId: Date.now(),
      };

      // Add a new document with a generated id.
      const docRef = await addDoc(
        collection(firestore, "messages"),
        newFeedback
      );

      if(userName=='finance@gmail.com' && feedback.email == '160522'){
        setShowResponse(true);
      } else if(userName=='s@n.com' && feedback.email == '160522'){
        setShowResponse(true);
      }
      
      setFeedback({
        userId: "",
        userName: "",
        email: feedback.email,
        message: "",
        date: "",
        messageId: "",
      });

      setLoading(false);
      setInputError("");
    },
    [
      currentUser?.uid,
      feedback.userId,
      feedback.userName,
      feedback.amount,
      feedback.message,
      feedback.email,
      feedback.date,
      feedback.messageId,
      dispatch,
    ]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="" >
        <div className={styles.form}>
          Provide Feedback:
          <CustomInput
            label="Email"
            type="string"
            id="email"
            value={feedback.email}
            onChange={handleEmailChange}
            required
          />
          <div>
            <textarea
              name="message"
              placeholder="Your feedback..."
              rows="3"
              cols="30"
              width="200px"
              maxLength="5000"
              onChange={handleMessageChange}
              error={inputError}
              value={feedback.message}
            />
          </div>
          <CustomButton type="submit" title={"Send"} disabled={loading} />
        </div>
        <div className={styles.form}>
          {showResponse && 
          <div>
            Response to your feedback:
            <GstList />
          </div>}
        </div>
      </div>
    </form>
  );
}

export default TaxSummary;

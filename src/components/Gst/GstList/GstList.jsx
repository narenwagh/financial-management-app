import React, { useEffect, useState } from "react";
import styles from "./GstList.module.css";
import MoonLoader from "react-spinners/MoonLoader";
import firebase from "firebase/compat/app";
import { firestore } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import CustomButton from "../../form/Button/CustomButton";
import { formatNumber } from "../../../utils/formatNumber";
import { formatDate } from "../../../utils/dateFormat";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

const GstList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const dispatch = useDispatch();

  const currentUser = useAuth();

  const [loading, setLoading] = useState(false);
  const [refreshResponses, setRefreshResponses] = useState(false);

  useEffect(() => {
    if (currentUser?.currentUser) {
      const fetchData = async () => {
        setLoading(true);
        const userId = currentUser.currentUser.uid;
        const userName = currentUser.currentUser.email;
        const userDocRef = firestore.collection("messages").doc(userId);
        const userDoc = await userDocRef.get();
        const userData = userDoc.data();
        setLoading(false);

/*         var start = new Date();
        start.setDate(start.getDate() - 1);
        var end = new Date();
 */
        var senderUserName = '';
        if(userName == 'admin@gmail.com'){
          senderUserName = 's@n.com'
          // setInterval(handleRefresh, 30000);
        } else if(userName == 'finance@gmail.com'){
          senderUserName = 'admin@gmail.com'
          // setInterval(handleRefresh, 30000);
        } else if(userName == 's@n.com'){
          senderUserName = 'admin@gmail.com'
          // setInterval(handleRefresh, 30000);
        } 

        const q = query(
          collection(firestore, "messages"),
          // where("date", ">", Timestamp.fromDate(start)),
          // where("date", "<", Timestamp.fromDate(end)),
          where("userName", "==", senderUserName),
          orderBy("date", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        let messages = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          // setFeedbackList(doc.data());

          let messageData = doc.data();
          messages.push(messageData);
          /* const sortedExpenses = Array.isArray(messageData?.messages)
          ? messageData.messages
          : []; */
        });

        console.log(messages);
        setFeedbackList(messages);
        // setRefreshResponses(false);
        /* const sortedGsts = Array.isArray(userData?.Gsts)
          ? userData.Gsts.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )
          : [];

        const filteredGsts = sortedGsts.filter(
          (item) =>
            formatDate(dates.from) <= item.date &&
            item.date <= formatDate(dates.to)
        ); */

        // dispatch(updateGstAction(filteredGsts));
      };

      fetchData();
    }
  }, [currentUser, dispatch, refreshResponses]);

  

  const handleRefresh = (event) => {
    console.log("refreshing responses");
    setRefreshResponses(!refreshResponses);
    // setInterval(setRefreshResponses(!refreshResponses), 30000);
  };

  return (
    <div >
      <CustomButton
        type="input"
        title={"Refresh"}
        onClick={handleRefresh}
        disabled={loading}
      ></CustomButton>
      <ul className={styles.list}>
        {loading ? (
          <div className={styles.loading}>
            <MoonLoader color="#2e8b43" />
          </div>
        ) : (
          <>
            {feedbackList?.length > 0 ? (
              <div>
                {feedbackList.map((feedback) => (
                  <div key={feedback.messageId}>
                    {/* <h6>Date : {feedback.date}</h6> */}
                    <h6>
                     {/*  Date :{" "} */}
                      {new Date(feedback.date?.toDate())?.toLocaleString()}
                    </h6>
                    {/* <h6>From : {feedback.userName}</h6> */}
                    <h6>{/* Response : */} {feedback.message}</h6>
                    <br />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>No feedback yet...</div>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default GstList;

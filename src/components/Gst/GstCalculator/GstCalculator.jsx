import React from 'react';
import GstForm from '../GstForm/GstForm';
import GstSummary from '../GstSummary/GstSummary';
import styles from './GstCalculator.module.css';

function GstCalculator() {
  return (
    <div className={styles.section}>
      <GstForm />
      <GstSummary />
    </div>
  );
}

export default GstCalculator;

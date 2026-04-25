import React, { useEffect, useState } from "react";
import Header from "../Header";
import Cards from "../Cards";
import { Modal } from "antd";
import AddExpensModal from "../Modals/addExpens";
import AddIncomeModal from "../Modals/addIncome";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import TransactionTable from "../TransactionTable";
import ChartComponent from "../Charts";
import NoTransaction from "../NoTransaction";

export default function Dashboard() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVsible] = useState(false);
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVsible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVsible(false);
  };
  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("document written with id: ", docRef.id);
      if(!many) toast.success("Transaction Added!");
      let newArray=transactions;
      newArray.push(transaction);
      setTransactions(newArray);
      calculateBalance();
    } catch (e) {
     console.error("Error adding document: ", e);
     if(!many) toast.error("coudn't add transaction");
    }
  } 
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  function calculateBalance() {
    let incomeTotal = 0,
      expenseTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setCurrentBalance(incomeTotal - expenseTotal);
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      console.log("transaction array", transactionArray);
      toast.success("transaction fetched!");
    }
    setLoading(false);
  }
  let sortedTransaction=transactions.sort((a,b)=>new Date(a.date)-new Date(b.date));
  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            currentBalance={currentBalance}
            income={income}
            expense={expense}
          /> 
          {transactions.length!==0?<ChartComponent sortedTransaction={sortedTransaction} />:<NoTransaction />}
          
          <AddExpensModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
        </>
      )}
    </div>
  );
}

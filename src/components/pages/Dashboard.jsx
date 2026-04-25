import React, { useEffect, useState } from "react";
import Header from "../Header";
import Cards from "../Cards";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../TransactionTable";
import ChartComponent from "../Charts";
import NoTransaction from "../NoTransaction";
import AddExpenseModal from "../Modals/AddExpense";
import AddIncomeModal from "../Modals/AddIncome";

export default function Dashboard() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  // ---------------- MODAL HANDLERS ----------------
  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  // ---------------- ADD TRANSACTION ----------------
  const onFinish = (values, type) => {
    const newTransaction = {
      type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      if (!user) return;

      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );

      if (!many) toast.success("Transaction Added!");

      // ✅ SAFE STATE UPDATE
      setTransactions((prev) => [...prev, transaction]);
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  // ---------------- FETCH TRANSACTIONS ----------------
  async function fetchTransactions() {
    try {
      if (!user) return;

      setLoading(true);

      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);

      const transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });

      setTransactions(transactionArray);
      toast.success("Transactions fetched!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- CALCULATE BALANCE ----------------
  function calculateBalance() {
    let incomeTotal = 0;
    let expenseTotal = 0;

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

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  // ✅ SAFE SORT (NO MUTATION)
  const sortedTransaction = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // ---------------- UI ----------------
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

          {transactions.length !== 0 ? (
            <ChartComponent sortedTransaction={sortedTransaction} />
          ) : (
            <NoTransaction />
          )}

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />

          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />

          <TransactionTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}
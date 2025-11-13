import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadInfo } from "./redux/counterSlice/userSlice";
import './App.css'
import AppRouter from './routes/index.jsx';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user info from localStorage when app starts
    dispatch(loadInfo());
  }, [dispatch]);

  return <AppRouter />;
}

function App() {
  return (
    <AppContent />
  )
}

export default App

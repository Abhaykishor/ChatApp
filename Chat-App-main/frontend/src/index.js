import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes/Index';
import { Provider } from 'react-redux'; // Correct import
import { Store } from './redux/Store';  // Make sure Store is the actual Redux store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Correct Provider component from react-redux */}
    <Provider store={Store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { Provider, useSelector } from "react-redux";
import { ReactReduxFirebaseProvider, isLoaded } from "react-redux-firebase";
import store, { rrfProps } from "./store";
// Component Imports
import App from "./views/App";
// Styling Imports
import "./assets/css/main.css";
import "./assets/css/generalcomponents.css";

function AuthIsLoaded({ children }) {
  // Functional component to show a spinning loader till auth status is loaded
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth)) {
    return (
      <section className="section loader__hero">
        <div className="loader"></div>
      </section>
    );
  } else {
    return children;
  }
}
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthIsLoaded>
          <App />
        </AuthIsLoaded>
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();

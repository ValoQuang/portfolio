import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./utils/ThemeProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);

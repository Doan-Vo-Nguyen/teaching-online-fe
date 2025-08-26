import { ToastContainer } from "react-toastify";
import AppRoutes from "./Routes/AppRoutes";
import { DuplicateLoginProvider } from "./context/DuplicateLoginContext";
import DevTools from "./components/DevTools";

const App = () => {
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <DuplicateLoginProvider>
      <div>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {isDev && <DevTools />}
      </div>
    </DuplicateLoginProvider>
  );
};

export default App;

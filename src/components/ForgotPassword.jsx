import daihocquynhon from "@/assets/images/daihocquynhon.jpg";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${daihocquynhon})`,
      }}
    >
      {/* Transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <div className="z-10 bg-transparent rounded-lg shadow-lg p-8 w-96">
       
        <ForgotPasswordForm/>
      </div>
    </div>
  );
};

export default ForgotPassword;

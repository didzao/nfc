import React, { useCallback } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToNFC = useCallback(() => {
    navigate("/nfc");
  }, []);

  const navigateToQRCode = useCallback(() => {
    navigate("/qr-code");
  }, []);

  const renderButtons = () => {
    return (
      <div className="button-container">
        <button className="button-nfc" onClick={navigateToNFC}>
          NFC
        </button>
        <button className="button-qrCode" onClick={navigateToQRCode}>
          QR Code
        </button>
      </div>
    );
  };
  return <div className="container">{renderButtons()}</div>;
};

export default HomePage;

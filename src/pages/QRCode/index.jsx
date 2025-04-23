import React, { useCallback, useState } from "react";
import qrCodeLogo from "../../assets/qr-code.svg";
import backArrow from "../../assets/back-arrow.svg";
import "./style.scss";
import QrReader from "react-qr-reader";
import { QRCode } from "qrcode.react";
import { useNavigate } from "react-router-dom";

const QRCodePage = () => {
  const [status, setStatus] = useState("");
  const [qrData, setQrData] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);

  const navigate = useNavigate();

  const goToHome = useCallback(() => {
    navigate("/");
  }, []);

  const renderHeader = () => {
    return (
      <div className="header">
        <a href="" onClick={goToHome} className="back-button">
          <img width={50} src={backArrow} alt="botão voltar" />
        </a>
        <img src={qrCodeLogo} alt="QrCode Logo" width={100} />
      </div>
    );
  };

  const handleScan = (data) => {
    if (data) {
      setQrData(data);
      setStatus("✅ Presença confirmada!");
      setShowScanner(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setStatus("❌ Erro ao acessar a câmera");
  };

  const handleStartScan = () => {
    setStatus("Aguardando leitura...");
    setShowScanner(true);
  };

  const handleGenerate = () => {
    if (!name || !id) {
      setStatus("❗ Preencha nome e ID para gerar QR Code");
      return;
    }
    setQrData(JSON.stringify({ nome: name, id }));
    setShowGenerated(true);
    setStatus("✅ QR Code gerado!");
  };

  const renderButtons = () => {
    return (
      <div className="button-container">
        <button className="button-scan" onClick={handleStartScan}>
          Ler QR Code
        </button>
        <button className="button-write" onClick={handleGenerate}>
          Gerar QR Code
        </button>
      </div>
    );
  };

  const renderStatus = () => {
    if (!qrData) return null;

    return <p className="status">Conteúdo da tag: {qrData}</p>;
  };

  const renderInput = () => {
    return (
      <div className="form">
        <input
          className="input"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button className="button-generate" onClick={handleGenerate}>
          Gerar QR Code
        </button>
      </div>
    );
  };

  const renderScanner = () => {
    if (!showScanner) return null;

    return (
      <div className="qr-scanner">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </div>
    );
  };

  const renderGenerate = () => {
    if (!showGenerated) return null;

    return (
      <div className="qr-generated">
        <p>QR Code para:</p>
        <QRCode value={qrData} size={200} />
      </div>
    );
  };

  return (
    <>
      <div className="container">
        {renderHeader()}
        <div className="content">
          <p className="status">{status}</p>
          {renderGenerate()}
          {renderInput()}
          {renderButtons()}
          {renderScanner()}
          {renderStatus()}
        </div>
      </div>
    </>
  );
};

export default QRCodePage;

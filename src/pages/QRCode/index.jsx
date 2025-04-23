import React, { useState, useCallback, useEffect } from "react";
import qrCodeLogo from "../../assets/qr-code.svg";
import backArrow from "../../assets/back-arrow.svg";
import { Html5QrcodeScanner } from "html5-qrcode";
import QRCode from "react-qr-code"; // Usando react-qr-code agora
import { useNavigate } from "react-router-dom";
import "./style.scss";

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
  }, [navigate]);

  const renderHeader = () => {
    return (
      <div className="header">
        <a href="#" onClick={goToHome} className="back-button">
          <img width={50} src={backArrow} alt="botão voltar" />
        </a>
        <img src={qrCodeLogo} alt="QrCode Logo" width={100} />
      </div>
    );
  };

  const handleScanSuccess = (decodedText) => {
    setQrData(decodedText);
    setStatus("✅ QR Code lido com sucesso!");
    setShowScanner(false);
  };

  const handleScanError = (errorMessage) => {
    setStatus(`❌ Erro: ${errorMessage}`);
  };

  const handleStartScan = () => {
    setStatus("Aguardando leitura...");
    setShowScanner(true);

    // Configuração do scanner do html5-qrcode
    const config = {
      fps: 10,
      qrbox: 250,
    };
    const scanner = new Html5QrcodeScanner("qr-scanner", config);
    scanner.render(handleScanSuccess, handleScanError);
  };

  const handleGenerate = () => {
    if (!name || !id) {
      setStatus("❗ Preencha nome e ID para gerar QR Code");
      return;
    }
    setQrData(JSON.stringify({ nome: name, id }));
    setShowGenerated(true);
    setName("");
    setId("");
    setStatus("✅ QR Code gerado!");
  };

  const renderInput = () => {
    return (
      <div className="input-container">
        <input
          value={name}
          className="input"
          placeholder="Nome"
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

  const renderButtons = () => {
    return (
      <div className="action-container">
        <button className="button-scan" onClick={handleStartScan}>
          Ler QR Code
        </button>
        {renderInput()}
      </div>
    );
  };

  const renderStatus = () => {
    if (!qrData) return null;

    return <p className="status">Conteúdo do QR Code: {qrData}</p>;
  };

  const renderScanner = () => {
    if (!showScanner) return null;

    return (
      <div id="qr-scanner" className="qr-scanner">
        {/* O scanner será renderizado aqui */}
      </div>
    );
  };

  const renderGenerate = () => {
    if (!showGenerated) return null;

    return (
      <div className="qr-generated">
        <QRCode value={qrData} size={200} />
      </div>
    );
  };

  useEffect(() => {
    return () => {
      if (showScanner) {
        const scanner = new Html5QrcodeScanner("qr-scanner");
        scanner.clear();
      }
    };
  }, [showScanner]);

  return (
    <>
      <div className="container">
        {renderHeader()}
        <div className="content">
          <p className="status">{status}</p>
          {renderButtons()}
          {renderScanner()}
          {renderStatus()}
          {renderGenerate()}
        </div>
      </div>
    </>
  );
};

export default QRCodePage;

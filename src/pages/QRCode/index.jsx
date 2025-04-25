import React, { useState, useCallback, useEffect, useRef } from "react";
import qrCodeLogo from "../../assets/qr-code.svg";
import backArrow from "../../assets/back-arrow.svg";
import { Html5QrcodeScanner } from "html5-qrcode";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const QRCodePage = () => {
  const qrRef = useRef(null);
  const [status, setStatus] = useState("");
  const [qrData, setQrData] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [qrCodeName, setQrCodeName] = useState("");
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
  };

  const handleGenerate = () => {
    if (!name || !id) {
      setStatus("❗ Preencha nome e ID para gerar QR Code");
      return;
    }
    setQrData(JSON.stringify({ nome: name, id }));
    setShowGenerated(true);
    setQrCodeName(name);
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

  const renderQRCodeData = () => {
    if (!qrData) return null;

    return <span className="status">Conteúdo do QR Code: {qrData}</span>;
  };

  const renderScanner = () => {
    if (!showScanner) return null;

    return <div id="qr-scanner" className="qr-scanner"></div>;
  };

  const renderGenerate = () => {
    if (!showGenerated) return null;

    return (
      <div className="qr-generated">
        <QRCode value={qrData} size={256} ref={qrRef} />
        <button className="button-download" onClick={handleDownload}>
          Baixar QR Code
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (!showScanner) return;

    const config = {
      fps: 10,
      qrbox: 250,
    };

    const scanner = new Html5QrcodeScanner("qr-scanner", config);

    scanner.render(handleScanSuccess, handleScanError);

    return () => {
      scanner.clear().catch((err) => {
        console.warn("Erro ao limpar scanner:", err);
      });
    };
  }, [showScanner]);

  const handleDownload = () => {
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");

      const fileName = qrCodeName
        ? `qrcode-${qrCodeName.replace(/\s+/g, "_")}.png`
        : "qrcode.png";
      downloadLink.download = fileName;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <>
      <div className="container">
        {renderHeader()}
        <div className="content">
          {renderButtons()}
          {renderScanner()}
          <span className="status">{status}</span>
          {renderQRCodeData()}
          {renderGenerate()}
        </div>
      </div>
    </>
  );
};

export default QRCodePage;

import React, { useState } from "react";
import nfcLogo from "/nfc.svg";
import "./app.scss";

const App = () => {
  const [nfcData, setNfcData] = useState("");
  const [status, setStatus] = useState("");

  const handleReadNFC = async () => {
    if (!("NDEFReader" in window)) {
      setStatus("🚫 Este navegador não suporta leitura NFC.");
      return;
    }
    try {
      setStatus("Aguardando leitura...");
      const reader = new NDEFReader();
      await reader.scan();

      reader.onreading = (event) => {
        const { message } = event;
        const text = new TextDecoder().decode(message.records[0].data);
        setNfcData(text);
        setStatus("✅ Tag lida com sucesso!");
      };
    } catch (err) {
      setStatus("❌ Erro ao ler NFC");
      console.error(err);
    }
  };

  const handleWriteNFC = async () => {
    try {
      const writer = new NDEFReader();
      await writer.write("Olá do React!");
      setStatus("✅ Tag escrita com sucesso!");
    } catch (err) {
      setStatus("❌ Erro ao escrever na tag");
      console.error(err);
    }
  };

  const renderStatus = () => {
    if (!nfcData) return null;

    return <p className="status">Conteúdo da tag: {nfcData}</p>;
  };

  return (
    <>
      <div className="container">
        <div className="logo">
          <img src={nfcLogo} alt="NFC Logo" width={100} />
        </div>
        <div className="content">
          <p className="status">{status}</p>
          <div className="button-container">
            <button className="button-scan" onClick={handleReadNFC}>
              Ler
            </button>
            <button className="button-write" onClick={handleWriteNFC}>
              Escrever
            </button>
          </div>
          {renderStatus()}
        </div>
      </div>
    </>
  );
};

export default App;

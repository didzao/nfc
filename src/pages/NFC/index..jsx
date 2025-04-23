import React, { useCallback, useState } from "react";
import nfcLogo from "../../assets/nfc.svg";
import backArrow from "../../assets/back-arrow.svg";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const NFCPage = () => {
  const [status, setStatus] = useState("");
  const [nfcData, setNfcData] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [textToWrite, setTextToWrite] = useState("");

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
        <img src={nfcLogo} alt="NFC Logo" width={100} />
      </div>
    );
  };

  const handleReadNFC = async () => {
    if (!("NDEFReader" in window)) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        setStatus("🚫 iOS ainda não suporta leitura NFC via navegador.");
      } else {
        setStatus("🚫 Este navegador não suporta leitura NFC.");
      }
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
    if (!("NDEFReader" in window)) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        setStatus("🚫 iOS ainda não suporta escrita NFC via navegador.");
      } else {
        setStatus("🚫 Este navegador não suporta escrita NFC.");
      }
      return;
    }

    try {
      const writer = new NDEFReader();
      await writer.write(textToWrite);
      setStatus("✅ Tag escrita com sucesso!");
      setShowInput(false);
      setTextToWrite("");
    } catch (err) {
      setStatus("❌ Erro ao escrever na tag");
      setShowInput(false);
      setTextToWrite("");
      console.error(err);
    }
  };

  const renderStatus = () => {
    if (!nfcData) return null;

    return <p className="status">Conteúdo da tag: {nfcData}</p>;
  };

  const handleStartWrite = () => {
    setShowInput(true);
    setStatus("");
  };

  const renderInput = () => {
    if (!showInput) return null;

    return (
      <div className="input-container ">
        <input
          type="text"
          className="input"
          value={textToWrite}
          placeholder="Digite o que deseja gravar"
          onChange={(e) => setTextToWrite(e.target.value)}
        />
        <button className="button-record" onClick={handleWriteNFC}>
          Gravar na tag
        </button>
      </div>
    );
  };

  const renderButtons = () => {
    return (
      <div className="button-container">
        <button className="button-scan" onClick={handleReadNFC}>
          Ler
        </button>
        <button className="button-write" onClick={handleStartWrite}>
          Escrever
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="container">
        {renderHeader()}
        <div className="content">
          <p className="status">{status}</p>
          {renderButtons()}
          {renderInput()}
          {renderStatus()}
        </div>
      </div>
    </>
  );
};

export default NFCPage;

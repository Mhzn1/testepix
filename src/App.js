import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { createStaticPix } from 'pix-utils';
import './App.css';
import Modal from 'react-modal';


function HistoryItem({ historyData, handleOpenDetails }) {
  return (
    <div className="history-item">
      <h3>Nome do Recebedor: {historyData.merchantName}</h3>
      <p>Chave Pix: {historyData.pixKey}</p>
      <p>Cidade do Recebedor: {historyData.merchantCity}</p>
      <p>Valor da Transação: R$ {(parseFloat(historyData.transactionAmount) / 100).toFixed(2)}</p>
      <p>Descrição: {historyData.infoAdicional}</p>
      <div className="qr-code-box">
        <QRCode value={historyData.brCode} />
      </div>
      
    </div>
  );
}

function showCustomNotification(message) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      const notification = new Notification("Título da Notificação", {
        body: message,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          const notification = new Notification("Título da Notificação", {
            body: message,
          });
        }
      });
    }
  }
}
function QRCodeCustom({ value, size, borderColor }) {
  const qrCodeStyle = {
    width: size,
    height: size,
    border: `3px solid ${borderColor}`, // Define a cor da borda aqui
  };

  return (
    <div style={qrCodeStyle}>
      <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${value}&size=${size}x${size}`} alt="QR Code" />
    </div>
  );
}


function App() {
  const [chavePix, setChavePix] = useState('');
  const [nomeRecebedor, setNomeRecebedor] = useState('');
  const [cidadeRecebedor, setCidadeRecebedor] = useState('');
  const [valorTransacao, setValorTransacao] = useState(0);
  const [infoAdicional, setInfoAdicional] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [historicoQRCode, setHistoricoQRCode] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedRecipientData, setSelectedRecipientData] = useState('');
  const [qrCodeBorderColor, setQRCodeBorderColor] = useState('#000000');
  const [logoImage, setLogoImage] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [qrCodeSize, setQRCodeSize] = useState(200);
  const [chavePixType, setChavePixType] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [selectedDetailsVisible, setSelectedDetailsVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQRCodeDetails, setSelectedQRCodeDetails] = useState(null);
  const [nomeRecebedorError, setNomeRecebedorError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [cidadeRecebedorError, setCidadeRecebedorError] = useState(null);

  const handleShowPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };
  const showCustomNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };
  

  const handleNomeRecebedorChange = (e) => {
    const newName = e.target.value;
    
    // Verifique se o novo valor contém apenas letras ou é vazio
    if (/^[A-Za-z\s]*$/.test(newName) || newName === '') {
      setNomeRecebedor(newName);
      setNomeRecebedorError(''); // Limpe o erro se o valor for válido
    } else {
      setNomeRecebedorError('Apenas letras');
    }
  };
  const handleChavePixChange = (e) => {
    const newChavePix = e.target.value;
    validateChavePix(newChavePix);
    setChavePix(newChavePix);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDetails = (details) => {
    setSelectedDetails(details);
    setSelectedDetailsVisible(true);
  };
  const validateChavePix = (chave) => {
    let isKeyValid = false;
    let chavePixType = 'Aleatória';
  
    const strChave = chave.replace(/[^\d]/g, '');
  
    if (/^\d{11}$/.test(strChave)) {
      let Soma = 0;
      let Resto;
      if (strChave === '00000000000' || strChave === '11111111111' || strChave === '22222222222' || strChave === '33333333333' || strChave === '44444444444' || strChave === '55555555555' || strChave === '66666666666' || strChave === '77777777777' || strChave === '88888888888' || strChave === '99999999999') {
        isKeyValid = false;
      } else {
        for (let i = 1; i <= 9; i++) {
          Soma = Soma + parseInt(strChave.substring(i - 1, i)) * (11 - i);
        }
  
        Resto = (Soma * 10) % 11;
  
        if (Resto === 10 || Resto === 11) {
          Resto = 0;
        }
  
        if (Resto !== parseInt(strChave.substring(9, 10))) {
          isKeyValid = false;
        }
  
        Soma = 0;
  
        for (let i = 1; i <= 10; i++) {
          Soma = Soma + parseInt(strChave.substring(i - 1, i)) * (12 - i);
        }
  
        Resto = (Soma * 10) % 11;
  
        if (Resto === 10 || Resto === 11) {
          Resto = 0;
        }
  
        if (Resto !== parseInt(strChave.substring(10, 11)) ) {
          isKeyValid = false;
        } else {
          setChavePixType('CPF');
          isKeyValid = true;
        }
      }
  
    } else if (/^\d{14}$/.test(chave)) {
      setChavePixType('CNPJ');
      isKeyValid = true;

      
    } else if (/^\d{12,14}$/.test(chave)) {
      setChavePixType('Telefone');
      isKeyValid = true;
    } else if (/^[0-9]{12,14}$/.test(chave)) {
      setChavePixType('Telefone');
      isKeyValid = true;
    } else if (/^[0-9]{12,14}$/.test(chave)) {
      setChavePixType('Telefone');
      isKeyValid = true;
    } else if (/^.+@.+\..+$/.test(chave)) {
      setChavePixType('Email');
      isKeyValid = true;
    } else {
      setChavePixType('Aleatória');
      isKeyValid = false;
    }
  
    const chavePixElement = document.getElementById('chavePix');
    if (isKeyValid) {
      chavePixElement.classList.remove('invalid-key');
      chavePixElement.classList.add('valid-key');
    } else {
      chavePixElement.classList.remove('valid-key');
      chavePixElement.classList.add('invalid-key');
    }
  };

  const handleBgColorChange = (e) => {
    setBgColor(e.target.value);
  };

  const handleFgColorChange = (e) => {
    setFgColor(e.target.value);
  };
  const handleOpenModal = (selectedQRCode) => {
    setSelectedQRCodeDetails(selectedQRCode);
    setIsModalOpen(true);
  };
  useEffect(() => {
    const historicoSalvo = localStorage.getItem('historicoQRCode');
    if (historicoSalvo) {
      setHistoricoQRCode(JSON.parse(historicoSalvo));
    }
  }, []);
  function formatCurrency(value) {
    return `R$ ${(parseFloat(value) / 100).toFixed(2)}`;
  }
  
  function handleValorTransacaoChange(e) {
    let newValue = e.target.value.replace('R$', '').trim();
  
    newValue = newValue.replace(/,|\.| /g, '');
  
    if (!isNaN(newValue) && newValue !== '') {
      setValorTransacao(parseInt(newValue, 10));
    } else {
      setValorTransacao(0);
    }
  }

  // Função para gerar um QR Code e salvar no histórico
  const handleGerarQRCode = () => {
    if (!chavePix || !nomeRecebedor || !cidadeRecebedor || valorTransacao <= 0) {
      setAlertMessage(
        <span className="red-text">Preencha todos os campos corretamente antes de gerar o QR Code.</span>
      );
      setShowAlert(true);
      return;
    }
  
    const elements = {
      merchantName: nomeRecebedor,
      merchantCity: cidadeRecebedor,
      pixKey: chavePix,
      infoAdicional: infoAdicional,
      transactionAmount: parseFloat(valorTransacao) / 100,
      logoImage,
    };
  
    const pix = createStaticPix(elements);
    const brCode = pix.toBRCode();
  
    // Atualiza o histórico e salva no localStorage
    const newHistoricoQRCode = [
      {
        merchantName: nomeRecebedor,
        merchantCity: cidadeRecebedor,
        transactionAmount: valorTransacao,
        infoAdicional: infoAdicional,
        pixKey: chavePix,
        brCode, // Atualize o brCode corretamente
        logoImage,
      },
      ...historicoQRCode,
    ].slice(0, 5); // Mantém apenas os últimos 5 elementos
  
    setHistoricoQRCode(newHistoricoQRCode);
    localStorage.setItem('historicoQRCode', JSON.stringify(newHistoricoQRCode));
  
    setQRCode(brCode); // Atualize o QR Code
  
    setShowAlert(false);
  };
  


  const handleLimparDados = () => {
    setChavePix('');
    setChavePixType('');
    setNomeRecebedor('');
    setCidadeRecebedor('');
    setValorTransacao(0);
    setInfoAdicional('');
    setShowQRCode(false);
    setLogoImage(null); // Remova a imagem
    setQRCode(''); // Limpe o QR Code
  };

  return (
    <div className="App">
    <header className="App-header">
      <div className="main-container">
        <header className="app-header">
          <h1 className="app-title">Zenith Design</h1>
          <h2 className="app-subtitle">Matheus Kunst Trasel</h2>
        </header>
        
        <div className="input-row">
          <div className="input-column">
            <div className="input-container">
              <label htmlFor="chavePix">Chave Pix</label>
              <input
                type="text"
                id="chavePix"
                placeholder="Digite sua Chave Pix*"
                value={chavePix}
                onChange={handleChavePixChange}
                className={`custom-input ${chavePixType === 'Aleatória' ? 'invalid-key' : 'valid-key'}`}
              />
              {chavePixType && <div> {chavePixType}</div>}
            </div>
            <div className="input-container">
            <label htmlFor="cidadeRecebedor">Cidade</label>
      <input
        type="text"
        id="cidadeRecebedor"
        placeholder="Cidade do Recebedor*"
        value={cidadeRecebedor}
        onChange={(e) => {
          const inputValue = e.target.value;
          const containsNumber = /\d/.test(inputValue);
          if (containsNumber) {
            setCidadeRecebedorError('Apenas letras');
          } else {
            setCidadeRecebedorError(null);
            setCidadeRecebedor(inputValue);
          }
        }}
        className="custom-input"
      />
      {cidadeRecebedorError && (
        <div className="error-message">{cidadeRecebedorError}</div>
      )}
    </div>
          </div>
          <div className="input-column">
            <div className="input-container">
              <label htmlFor="nomeRecebedor">Nome</label>
              <input
                type="text"
                id="nomeRecebedor"
                placeholder="Nome do Recebedor*"
                value={nomeRecebedor}
                onChange={handleNomeRecebedorChange}
                className="custom-input"
              />
              {nomeRecebedorError && <div className="error-message">{nomeRecebedorError}</div>}
            </div>
            <div className="input-container">
              <label htmlFor="valorTransacao">Valor</label>
              <input
                type="text"
                id="valorTransacao"
                placeholder="Valor da Transação (R$)"
                value={formatCurrency(valorTransacao)}
                onChange={handleValorTransacaoChange}
                className="custom-input"
              />
            </div>
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="infoAdicional">Descrição</label>
          
          <textarea
            id="infoAdicional"
            placeholder="Descrição/Informação Adicional (140 caracteres)"
            value={infoAdicional}
            style={{ height: '150px', width: '825px', resize: 'none' }}
            onChange={(e) => setInfoAdicional(e.target.value)}
            className="custom-input"
          />
          {showAlert && (
          <div className="alert-overlay">
            <div className="alert alert-danger" role="alert">
              {alertMessage}
            </div>
          </div>
        )}
        </div>
        <div className="button-container">
          <button className="custom-button" onClick={handleGerarQRCode}>
            Gerar QR Code Pix
          </button>
          <button className="custom-button" onClick={handleLimparDados}>
            Limpar Dados
          </button>
        </div>
      </div>
    </header>
    <div className="side-container">
      <div className="history-container">
        <div className="header-buttons">
          <button
            className={`toggle-button qr-code-button ${!showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(false)}
          >
            QR Code
          </button>
          <button
            className={`toggle-button history-button ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(true)}
          >
            Histórico
          </button>
        </div>
  
        {showPopup && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowPopup(false)}></button>
            </div>
            <div className="toast-body">
              {popupMessage}
            </div>
          </div>
        )}
        {showHistory ? (
            <>
              <h2 style={{ textAlign: 'center' }}>QR Codes Salvos:</h2>

              <div className="select-container">
                <div className="qr-codes-history">
                  {historicoQRCode.slice(0, 5).map((item, index) => (
                    <div className="qr-code-item" key={index}>
                      <div className="qr-code-data">
                        <p>Nome: {item.merchantName}</p>
                        <p>Chave: {item.pixKey}</p>
                        <p>Valor: {formatCurrency(item.transactionAmount)}</p>
                      </div>
                      <button onClick={() => handleOpenModal(item)}>Abrir Detalhes</button>
                      <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            contentLabel="Exemplo de Modal"
                            className="custom-modal"
                            
                        style={{
                          overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Cor de fundo semitransparente
                            zIndex: isModalOpen ? 10 : -1, // Coloque-o acima do conteúdo da página se isModalOpen for verdadeiro, caso contrário, coloque em -1
                          },
                          content: {
                            // Estilos para o conteúdo do modal
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            // Adicione outros estilos conforme necessário
                          },
                        }}
                      >
                  
                    <div className="modal-content-wrapper">
                    <h1>Dados do QR code</h1>
                    {selectedQRCodeDetails && (
                      <>
                        <p><strong>Nome do Recebedor:</strong> {selectedQRCodeDetails.merchantName}</p>
                <p><strong>Chave Pix:</strong> {selectedQRCodeDetails.pixKey}</p>
                <p><strong>Cidade do Recebedor:</strong> {selectedQRCodeDetails.merchantCity}</p>
                <p><strong>Valor da Transação:</strong> R$ {(parseFloat(selectedQRCodeDetails.transactionAmount) / 100).toFixed(2)}</p>
                <p><strong>Descrição:</strong> {selectedQRCodeDetails.infoAdicional}</p>

                <div className="qr-code-box">
                  <QRCode value={selectedQRCodeDetails.brCode} />
                </div>
              </>
            )}
            <button onClick={closeModal} className="close-button">
              Fechar Detalhes
            </button>
          </div>
        </Modal>
                    </div>
                  ))}
                </div>
              </div>
              {selectedRecipient && (
                <div className="selected-history">
                  <HistoryItem historyData={selectedRecipientData} handleOpenDetails={handleOpenDetails} />
                </div>
              )}
            </>
          ) : (
            <div className="qr-code-container">
              <div className="qr-code-text">
              <h3 style={{ textAlign: 'center' }}>Personalização!</h3>
              </div>
              <div className="qr-code-box">
                <QRCode value={qrCode} size={qrCodeSize} bgColor={bgColor} fgColor={fgColor} />
                {logoImage && <img src={logoImage} alt="Logo" className="logoImage" style={{ width: '40px', height: '40px' }} />}
              </div>

              <div className="color-options">
                <label htmlFor="bgColor">Cor de Fundo:</label>
                <input type="color" id="bgColor" value={bgColor} onChange={handleBgColorChange} />
                <label htmlFor="fgColor">Cor do Código:</label>
                <input type="color" id="fgColor" value={fgColor} onChange={handleFgColorChange} />
              <input
                type="file"
                accept="image/*"
                id="logoImage"
                onChange={(e) => setLogoImage(URL.createObjectURL(e.target.files[0]))}
                style={{ display: 'none' }}
              />
              <label htmlFor="logoImage" className="custom-file-label">
                <span>Adicionar Imagem</span>
              </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;

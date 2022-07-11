import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import Login from './Login';
import Dashboard from './Dashboard';
import { ContactsProvider } from '../contexts/ContactsProvider';
import { ConversationProvider } from '../contexts/ConversationProvider';
import { SocketProvider } from '../contexts/SocketProvider';
import RegistrationForm from './Registration';
import useLocalStorage from '../hooks/localStorage';

const decryptText = (encryptedText) => {
  console.log(process.env.REACT_APP_SECRET_KEY);
  const bytes = CryptoJS.AES.decrypt(encryptedText, 'process.env.SECRET_KEY');
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return { decryptedText };
};

function App() {
  const [redirect, setRedirect] = useState('login');
  const [id, setId] = useLocalStorage('id');
  const [loginId, setLoginId] = useState();

  if (id && !loginId) {
    console.log(id);
    const { decryptedText: loginId } = decryptText(id);
    return setLoginId(loginId);
  }

  const dashboard = (
    <SocketProvider id={loginId}>
      <ContactsProvider id={loginId}>
        <ConversationProvider id={loginId}>
          <Dashboard />
        </ConversationProvider>
      </ContactsProvider>
    </SocketProvider>
  );

  if (redirect === 'login') {
    return <Login onIdSubmit={setId} onRedirection={setRedirect} />;
  }

  if (redirect === 'registration') {
    return <RegistrationForm onRedirection={setRedirect} />;
  }

  if (redirect === 'dashboard') {
    return dashboard;
  }

  return loginId ? (
    dashboard
  ) : (
    <Login onIdSubmit={setId} onRedirection={setRedirect} />
  );
}

export default App;

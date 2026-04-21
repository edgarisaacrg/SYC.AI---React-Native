import React, {useState, useRef} from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import Header from './src/components/Header';
import BurbujaDeMensaje from './src/components/BurbujaDeMensaje';
import BarraDeEscritura from './src/components/BarraDeEscritura';
import AnimacionPensando from './src/components/AnimacionPensando';
import VentanaConfiguracion from './src/components/VentanaConfiguracion';
import MenuHistorial from './src/components/MenuLateral';

export default function App() {
  const [modoOscuro, setModoOscuro] = React.useState(true);
  const [iaPensando, setIaPensando] = useState(false);
  const scrollViewRef = useRef(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mensajesActuales, setMensajesActuales] = useState([
    { id: '1', texto: 'Hola, soy SYC. ¿En qué te puedo ayudar hoy?', esUsuario: false }
  ]);
  const [listaDeChats, setListaDeChats] = useState([]);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [urlOllama, setUrlOllama] = useState('');

  const [idChatActual, setIdChatActual] = useState(Date.now().toString());
  const [cargadoCompleto, setCargadoCompleto] = useState(false);

  useEffect(() => {
    const arrancarMemoria = async () => {
      try {
        const chatGuardado = await AsyncStorage.getItem('@syc_chat_actual');
        const idGuardado = await AsyncStorage.getItem('@syc_id_actual');
        const listaGuardada = await AsyncStorage.getItem('@syc_lista_chats');
        const urlGuardada = await AsyncStorage.getItem('@syc_url_ollama');

        if (chatGuardado) setMensajesActuales(JSON.parse(chatGuardado));
        if (idGuardado) setIdChatActual(idGuardado);
        if (listaGuardada) setListaDeChats(JSON.parse(listaGuardada));
        if (urlGuardada) setUrlOllama(urlGuardada);
      } catch (e) {
        Alert.alert("Error", "No pude cargar los datos.");
      } finally {
        setCargadoCompleto(true);
      }
    };
    arrancarMemoria();
  }, []);

  useEffect(() => {
    if (!cargadoCompleto || mensajesActuales.length <= 1) return;

    setListaDeChats(prevLista => {
      const existe = prevLista.find(chat => chat.id === idChatActual);
      if (existe) {
        return prevLista.map(chat => 
          chat.id === idChatActual ? { ...chat, mensajes: mensajesActuales } : chat
        );
      } else {
        return [{ 
          id: idChatActual, 
          titulo: mensajesActuales[1].texto, 
          mensajes: mensajesActuales 
        }, ...prevLista];
      }
    });
  }, [mensajesActuales, idChatActual, cargadoCompleto]);

  useEffect(() => {
    if (!cargadoCompleto) return;
    AsyncStorage.setItem('@syc_chat_actual', JSON.stringify(mensajesActuales));
    AsyncStorage.setItem('@syc_id_actual', idChatActual);
  }, [mensajesActuales, idChatActual, cargadoCompleto]);

  const manejarNuevoChat = () => {
    setIdChatActual(Date.now().toString());
    setMensajesActuales([
      { id: '1', texto: 'Hola, soy SYC. ¿En qué te puedo ayudar hoy?', esUsuario: false }
    ]);
    setMostrarHistorial(false); 
  };

  const cargarChatHistorico = (idDelChat) => {
    const chatEncontrado = listaDeChats.find(chat => chat.id === idDelChat);
    if (chatEncontrado) {
      setIdChatActual(chatEncontrado.id);
      setMensajesActuales(chatEncontrado.mensajes);
    }
    setMostrarHistorial(false);
  };

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    className={`flex-1 ${modoOscuro ? 'bg-zinc-950' : 'bg-slate-50'}`}>
      <StatusBar style={modoOscuro ? 'light' : 'dark' }/>

      <Header 
        modoOscuro={modoOscuro} 
      alPrecionarHistorial={() => setMostrarHistorial(true)} 
      alPresionarConfiguracion={() => setMostrarConfiguracion(true)}
      />

      <ScrollView 
      ref={scrollViewRef}
      onContentSizeChange={()=> scrollViewRef.current?.scrollToEnd({animated: true})}
      className="flex-1 px-4 pt-4"
      contentContainerStyle={{ paddingBottom: 20 }}
      >
        {mensajesActuales.map(mensaje => (
          <BurbujaDeMensaje key={mensaje.id} mensaje={mensaje} modoOscuro={modoOscuro}/>
        ))}
        {iaPensando && <AnimacionPensando modoOscuro={modoOscuro}/>}
      </ScrollView>

      <BarraDeEscritura 
        modoOscuro={modoOscuro} 
        alEnviar={async(texto) => {
          const idUsuario = Date.now().toString();
          const nuevoMensaje = { id: idUsuario, texto, esUsuario: true };
          setMensajesActuales(prev => [...prev, nuevoMensaje]);

          setIaPensando(true);

          try {
            const urlNgrok = `${urlOllama.replace(/\/$/, '')}/api/chat`;

            const historialParaOllama = mensajesActuales.slice(-10).map(msg => ({
              role: msg.esUsuario ? 'user' : 'assistant',
              content: msg.texto
            }));
            
            historialParaOllama.push({ role: 'user', content: texto });

            const respuesta = await fetch(urlNgrok, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
              },
              body: JSON.stringify({
                model: 'syc-ai',
                messages: historialParaOllama,
                stream: false
              })
            });

            const textoCrudo = await respuesta.text();

            try {
              const datos = JSON.parse(textoCrudo);
              if (datos.message && datos.message.content) {
                const idIA = (Date.now() + 1).toString();
                const respuestaIA = { id: idIA, texto: datos.message.content, esUsuario: false };
                setMensajesActuales(prev => [...prev, respuestaIA]);
              }
            } catch (errorParseo) {
              console.error("Error parseo:", textoCrudo);
            }
          } catch (error) {
            console.error('Error:', error);
          } finally {
            setIaPensando(false);
          }
        }}
      />

      {/* Ventana de configuración */}
      <VentanaConfiguracion 
        visible={mostrarConfiguracion} 
        alCerrar={() => setMostrarConfiguracion(false)}
        modoOscuro={modoOscuro}
        urlOllama={urlOllama}
        setUrlOllama={setUrlOllama}
      />

      {/* Menú de historial */}
      <MenuHistorial 
        visible={mostrarHistorial}
        alCerrar={() => setMostrarHistorial(false)}
        modoOscuro={modoOscuro}
        historialFalso={listaDeChats} 
        alPresionarNuevoChat={manejarNuevoChat}
        alPresionarChat={cargarChatHistorico} // <--- NUEVA MAGIA AQUÍ
      />

    </KeyboardAvoidingView>
  );
}
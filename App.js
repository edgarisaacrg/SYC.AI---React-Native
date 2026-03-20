import React, {useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import Header from './src/components/Header';
import BurbujaDeMensaje from './src/components/BurbujaDeMensaje';
import BarraDeEscritura from './src/components/BarraDeEscritura';
import AnimacionPensando from './src/components/AnimacionPensando';
import VentanaConfiguracion from './src/components/VentanaConfiguracion';

export default function App() {
  const [modoOscuro, setModoOscuro] = React.useState(true);
  const [iaPensando, setIaPensando] = useState(false);
  const scrollViewRef = useRef(null);

  const [mensajesActuales, setMensajesActuales] = useState([
    { id: 1, texto: 'Hola, soy SYC. ¿En qué te puedo ayudar hoy?', esUsuario: false }
  ]);

  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [urlOllama, setUrlOllama] = useState('');

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    className={`flex-1 ${modoOscuro ? 'bg-zinc-950' : 'bg-slate-50'}`}>
      <StatusBar style={modoOscuro ? 'light' : 'dark' }/>

      <Header 
        modoOscuro={modoOscuro} 
        alPrecionarHistorial={() => console.log('Abrir historial')} 
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
            content: msg.textos
          }));
          
          historialParaOllama.push({ role: 'user', content: texto });

          const respuesta = await fetch(urlNgrok, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngork-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
              model: 'llama3.2',
              messages:historialParaOllama,
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
              } else {
                console.error("El JSON llegó pero no tiene el mensaje:", datos);
              }

            } catch (errorParseo) {
              console.error("¡ALERTA! El servidor no mandó un JSON. Esto fue lo que mandó:", textoCrudo);
              const idIA = (Date.now() + 1).toString();
              const respuestaIA = { 
                id: idIA, 
                texto: `Error del servidor: "${textoCrudo}"`, 
                esUsuario: false 
              };
              setMensajesActuales(prev => [...prev, respuestaIA]);
            }
        } catch (error) {
          console.error('Error conectando con Ollama:', error);
          const mensajeError = {
            id: (Date.now() + 1).toString(),
            texto: 'Lo siento, ha ocurrido un error al conectar con el modelo.',
            esUsuario: false
          };
          setMensajesActuales(prev => [...prev, mensajeError]);
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

    </KeyboardAvoidingView>
  );
}



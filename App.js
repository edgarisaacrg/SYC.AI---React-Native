import React, {useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import Header from './src/components/Header';
import BurbujaDeMensaje from './src/components/BurbujaDeMensaje';
import BarraDeEscritura from './src/components/BarraDeEscritura';
import AnimacionPensando from './src/components/AnimacionPensando';

export default function App() {
  const [modoOscuro, setModoOscuro] = React.useState(true);
  const [iaPensando, setIaPensando] = useState(false);
  const scrollViewRef = useRef(null);

  const [mensajesActuales, setMensajesActuales] = useState([
    { id: 1, texto: 'Hola, soy SYC. ¿En qué te puedo ayudar hoy?', esUsuario: false }
  ]);

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    className={`flex-1 ${modoOscuro ? 'bg-zinc-950' : 'bg-slate-50'}`}>
      <StatusBar style={modoOscuro ? 'light' : 'dark' }/>

      <Header 
        modoOscuro={modoOscuro} 
        alPrecionarHistorial={() => console.log('Abrir historial')} 
        alPresionarConfiguracion={() => console.log('Abrir configuración')}
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
      alEnviar={(texto) => {
        const idUsuario = Date.now().toString();
        const nuevoMensaje = { id: idUsuario, texto, esUsuario: true };
        setMensajesActuales(prev => [...prev, nuevoMensaje]);

        setIaPensando(true);

        setTimeout(() => {
          const idIa = (Date.now() + 1).toString();
          const respuestaIA = { 
            id: idIa, 
            texto: '¡Mensaje recibido! Todavía no estoy conectada a Ollama, pero esta será mi respuesta.', 
            esUsuario: false };
            
          setMensajesActuales(prev => [...prev, respuestaIA]);

          setIaPensando(false);
        }, 2000);
      }} 
      />

    </KeyboardAvoidingView>
  );
}



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
      alEnviar={async(texto) => {
        const idUsuario = Date.now().toString();
        const nuevoMensaje = { id: idUsuario, texto, esUsuario: true };
        setMensajesActuales(prev => [...prev, nuevoMensaje]);

        setIaPensando(true);

        try {
          const urlNgrok = 'https://369d-2806-261-498-e57-41b8-de4b-b786-2221.ngrok-free.app/api/chat';

          const respuesta = await fetch(urlNgrok, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngork-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
              model: 'llama3.2',
              messages:[ {role: 'user', content: texto} ],
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

    </KeyboardAvoidingView>
  );
}



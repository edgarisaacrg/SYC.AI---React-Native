import React, { useState, useRef } from "react";

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

// Componentes
import Header from "./src/components/Header";
import BurbujaDeMensaje from "./src/components/BurbujaDeMensaje";
import BarraDeEscritura from "./src/components/BarraDeEscritura";
import AnimacionPensando from "./src/components/AnimacionPensando";
import VentanaConfiguracion from "./src/components/VentanaConfiguracion";
import MenuHistorial from "./src/components/MenuLateral";

export default function App() {
  // --- ESTADOS DE UI ---
  const [modoOscuro, setModoOscuro] = React.useState(true);
  const [iaPensando, setIaPensando] = useState(false);
  const scrollViewRef = useRef(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [mensajeConfig, setMensajeConfig] = useState('');

  // --- ESTADOS DE DATOS ---
  const [listaDeChats, setListaDeChats] = useState([]);
  const [urlOllama, setUrlOllama] = useState("");
  const [idChatActual, setIdChatActual] = useState(Date.now().toString());
  const [cargadoCompleto, setCargadoCompleto] = useState(false); // Flag vital para no sobreescribir memoria al iniciar
  
  // Chat por defecto
  const [mensajesActuales, setMensajesActuales] = useState([
    {
      id: "1",
      texto: "Hola, soy SYC. ¿En qué te puedo ayudar hoy?",
      esUsuario: false,
    },
  ]);

  // 1. Carga inicial: Sacamos la info del AsyncStorage al montar la app
  useEffect(() => {
    const arrancarMemoria = async () => {
      try {
        const listaGuardada = await AsyncStorage.getItem("@syc_lista_chats");
        const urlGuardada = await AsyncStorage.getItem("@syc_url_ollama");

        if (listaGuardada) setListaDeChats(JSON.parse(listaGuardada));
        if (urlGuardada) setUrlOllama(urlGuardada);

        // Reiniciamos la vista con un chat en blanco
        setIdChatActual(Date.now().toString());
        setMensajesActuales([
          {
            id: "1",
            texto: "Hola, soy SYC. ¿En qué te puedo ayudar hoy?",
            esUsuario: false,
          },
        ]);
      } catch (e) {
        Alert.alert("Error", "No pude cargar los datos.");
      } finally {
        setCargadoCompleto(true);
      }
    };
    arrancarMemoria();
  }, []);

  // 2. Sincronizar el chat actual con la lista del historial general
  useEffect(() => {
    if (!cargadoCompleto || mensajesActuales.length <= 1) return;

    setListaDeChats((prevLista) => {
      const existe = prevLista.find((chat) => chat.id === idChatActual);
      if (existe) {
        return prevLista.map((chat) =>
          chat.id === idChatActual
            ? { ...chat, mensajes: mensajesActuales }
            : chat,
        );
      } else {
        return [
          {
            id: idChatActual,
            titulo: mensajesActuales[1].texto,
            mensajes: mensajesActuales,
          },
          ...prevLista,
        ];
      }
    });
  }, [mensajesActuales, idChatActual, cargadoCompleto]);

  // 3. Autoguardado: Guardamos el chat actual en memoria
  useEffect(() => {
    if (!cargadoCompleto) return;
    AsyncStorage.setItem("@syc_chat_actual", JSON.stringify(mensajesActuales));
    AsyncStorage.setItem("@syc_id_actual", idChatActual);
  }, [mensajesActuales, idChatActual, cargadoCompleto]);

  // 4. Autoguardado: Guardamos el historial completo en memoria
  useEffect(() => {
    if (!cargadoCompleto) return;
    AsyncStorage.setItem("@syc_lista_chats", JSON.stringify(listaDeChats));
  }, [listaDeChats, cargadoCompleto]);

  // Limpia la pantalla para un nuevo hilo
  const manejarNuevoChat = () => {
    setIdChatActual(Date.now().toString());
    setMensajesActuales([
      {
        id: "1",
        texto: "Hola, soy SYC. ¿En qué te puedo ayudar hoy?",
        esUsuario: false,
      },
    ]);
    setMostrarHistorial(false);
  };

  // Restaura un chat viejo al seleccionarlo en el menú lateral
  const cargarChatHistorico = (idDelChat) => {
    const chatEncontrado = listaDeChats.find((chat) => chat.id === idDelChat);
    if (chatEncontrado) {
      setIdChatActual(chatEncontrado.id);
      setMensajesActuales(chatEncontrado.mensajes);
    }
    setMostrarHistorial(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      className={`flex-1 ${modoOscuro ? "bg-zinc-950" : "bg-slate-50"}`}
    >
      <StatusBar style={modoOscuro ? "light" : "dark"} />

      <Header
        modoOscuro={modoOscuro}
        alPrecionarHistorial={() => setMostrarHistorial(true)}
        alPresionarConfiguracion={() => setMostrarConfiguracion(true)}
      />

      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {mensajesActuales.map((mensaje) => (
          <BurbujaDeMensaje
            key={mensaje.id}
            mensaje={mensaje}
            modoOscuro={modoOscuro}
          />
        ))}
        {iaPensando && <AnimacionPensando modoOscuro={modoOscuro} />}
      </ScrollView>

      <BarraDeEscritura
        modoOscuro={modoOscuro}
        alEnviar={async(texto) => {
          // 1. Validamos que tengamos a dónde mandarlo
          if (!urlOllama || urlOllama.trim() === '') {
            setMensajeConfig('Para poder platicar con SYC, pega tu URL de Ngrok aquí abajo');
            setMostrarConfiguracion(true);
            return;
          }

          // 2. Imprimimos en pantalla el mensaje del usuario de inmediato
          const idUsuario = Date.now().toString();
          const nuevoMensaje = { id: idUsuario, texto, esUsuario: true };
          setMensajesActuales((prev) => [...prev, nuevoMensaje]);

          setIaPensando(true);

          try {
            const urlNgrok = `${urlOllama.replace(/\/$/, "")}/api/chat`;

            const historialParaOllama = mensajesActuales
              .slice(-10)
              .map((msg) => ({
                role: msg.esUsuario ? "user" : "assistant",
                content: msg.texto,
              }));

            historialParaOllama.push({ role: "user", content: texto });
            
            // 3. Disparamos el fetch a Ngrok -> Ollama local
            const respuesta = await fetch(urlNgrok, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
              body: JSON.stringify({
                model: "syc-ai",
                messages: historialParaOllama,
                stream: false,
              }),
            });

            // Leemos como texto crudo primero por si Ngrok avienta un HTML de error
            const textoCrudo = await respuesta.text();

            try {
              const datos = JSON.parse(textoCrudo);
              if (datos.message && datos.message.content) {
                const idIA = (Date.now() + 1).toString();
                const respuestaIA = {
                  id: idIA,
                  texto: datos.message.content,
                  esUsuario: false,
                };
                setMensajesActuales((prev) => [...prev, respuestaIA]);
              }
            } catch (errorParseo) {
              console.error("Error parseo:", textoCrudo);
            }
          } catch (error) {
            console.error("Error:", error);
            Alert.alert(
              "Error de conexión",
              "Asegúrate de que Ollama y Ngrok estén corriendo en tu PC.",
            );
          } finally {
            setIaPensando(false);
          }
        }}
      />

      {/* --- Modales --- */}

      {/* Ventana de configuración */}
      <VentanaConfiguracion
        visible={mostrarConfiguracion}
        alCerrar={() => setMostrarConfiguracion(false)}
        modoOscuro={modoOscuro}
        urlOllama={urlOllama}
        setUrlOllama={setUrlOllama}
        mensajeAviso={mensajeConfig}
      />

      {/* Menú de historial */}
      <MenuHistorial
        visible={mostrarHistorial}
        alCerrar={() => setMostrarHistorial(false)}
        modoOscuro={modoOscuro}
        historialFalso={listaDeChats}
        alPresionarNuevoChat={manejarNuevoChat}
        alPresionarChat={cargarChatHistorico}
      />
    </KeyboardAvoidingView>
  );
}

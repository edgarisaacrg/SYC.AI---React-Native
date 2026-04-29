import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";

export default function BarraDeEscritura({ modoOscuro, alEnviar }) {
  // Estado local que controla lo que se va tipeando en tiempo real
  const [texto, setTexto] = React.useState("");

  // Valida que no nos manden strings vacíos, dispara el mensaje al padre y limpia el input
  const manejarEnvio = () => {
    if (texto.trim() === "") return;
    alEnviar(texto);
    setTexto("");
  };

  return (
    <View
      className={`p-4 mb-1 border-t ${modoOscuro ? "bg-zinc-950" : "bg-white border-slate-200"}`}
    >
      <View
        className={`flex-row items-center gap-2 rounded-full p-1 pl-4 border shadow-sm
          ${modoOscuro ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}
      >
        {/* Caja de Texto */}
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={modoOscuro ? "#B8B8BC" : "#94a3b8"}
          className="flex-1 text-sm"
          style={{ color: modoOscuro ? "#f4f4f5" : "#0f172a" }}
          returnKeyType="send"
          onSubmitEditing={manejarEnvio}
        />

        {/* Boton de Enviar */}
        <TouchableOpacity
          onPress={manejarEnvio}
          disabled={texto.trim() === ""}
          className={`p-2.5 rounded-full items-center justify-center 
                  ${
                    texto.trim() !== ""
                      ? "bg-yellow-400"
                      : modoOscuro
                        ? "bg-zinc-700"
                        : "bg-slate-200"
                  }`}
        >
          <Send
            size={16}
            color={
              texto.trim() !== "" ? "#000" : modoOscuro ? "#52525b" : "#cbd5e1"
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

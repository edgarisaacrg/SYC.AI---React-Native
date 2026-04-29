import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { History, Settings } from "lucide-react-native";

export default function Header({
  modoOscuro,
  alPrecionarHistorial,
  alPresionarConfiguracion,
}) {
  const colorIconos = modoOscuro ? "#a1a1aa" : "#64748b";
  return (
    <View
      className={`flex-row items-center justify-between p-3 border-b pt-12 mt-4 ${modoOscuro ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-200"}`}
    >
      {/*Botón Historial */}
      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={alPrecionarHistorial}
          className={`p-2 rounded-lg ${modoOscuro ? "bg-zinc-900" : "bg-slate-100"}`}
        >
          <History size={22} color={colorIconos} />
        </TouchableOpacity>
        {/* La Barra espaciadora */}
        <View
          className={`w-[1px] h-6 ${modoOscuro ? "bg-zinc-800" : "bg-slate-200"}`}
        />

        <Text
          className={`text-xl font-black tracking-wider ${modoOscuro ? "text-yellow-400" : "text-yellow-600"}`}
        >
          SYC
          <Text
            className={`font-light ${modoOscuro ? "text-zinc-500" : "text-slate-400"}`}
          >
            .AI
          </Text>
        </Text>
      </View>

      {/* Botón Configuración */}
      <TouchableOpacity
        onPress={alPresionarConfiguracion}
        className={`p-2 rounded-lg ${modoOscuro ? "bg-zinc-900" : "bg-slate-100"}`}
      >
        <Settings size={22} color={colorIconos} />
      </TouchableOpacity>
    </View>
  );
}

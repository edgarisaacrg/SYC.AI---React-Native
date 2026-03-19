import React from "react";
import { View, Text } from "react-native";

export default function BurbujaDeMensaje({ mensaje, modoOscuro }) {
    const esMio = mensaje.esUsuario;

    const estiloCaja = esMio 
    ? 'bg-yellow-400 rounded-tr-sm border border-transparent' 
    : modoOscuro 
        ? 'bg-zinc-800 border border-zinc-700 rounded-tl-sm' 
        : 'bg-white border - border-slate-200 rounded-tl-sm';
    
    const estiloTexto = esMio 
    ? 'text-black' 
    : modoOscuro 
        ? 'text-zinc-100' 
        : 'text-slate-800';

    return (
        <View className={`flex-row w-full mb-3 ${esMio ? 'justify-end' : 'justify-start'}`}>
            {/* Caja de texto */}
            <View className={`max-w-[80%] p-3 px-4 rounded-2xl shadow-sm ${estiloCaja}`}>
                <Text className={`text-sm leading-relaxed ${estiloTexto}`}>
                    {mensaje.texto}
                </Text>
            </View>
        </View>
    );
}
import React from "react";
import {View, Text, ActivityIndicator} from 'react-native'

export default function AnimacionPensando({ modoOscuro }){
    const colorCarga = modoOscuro ? '#f59e0b' : '#d97706';
    return (
        <View className="flex-row w-full mb-3 justify-start">

            <View className={`p-3 px-5 rounded-2xl rounded-bl-sm border flex-row items-center gap-2 
            ${modoOscuro ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'}`}>
                {/* Circulo de carga*/}
                <ActivityIndicator size="small" color={colorCarga} />
                <Text className={`text-sm ${modoOscuro ? 'text-zinc-400' : 'text-slate-500'}`}>
                    SYC está pensando...
                </Text>
            </View>
        </View>
    );

}
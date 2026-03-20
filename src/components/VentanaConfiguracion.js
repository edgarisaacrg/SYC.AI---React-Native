import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';

import { X } from 'lucide-react-native';

export default function VentanaConfiguracion({ 
    visible, 
    alCerrar,
    modoOscuro, 
    urlOllama, 
    setUrlOllama
}){
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={alCerrar}
    >
        <View className="flex-1 justify-end bg-black/60">
            <View className={`rounded-t-3xl p-6 h-2/3 shadow-2xl ${modoOscuro ? 'bg-zinc-900' : 'bg-white'}`}> 
                <View className={`flex-row justify-between items-center mb-6 pb-44 border-b ${modoOscuro ? 'border-zinc-700' : 'border-zinc-300'}`}>
                    <Text className={`text-xl font-bold ${modoOscuro ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        Configuración
                    </Text>
                    <TouchableOpacity 
                    onPress={alCerrar} 
                    className={`p-2 rounded-full ${modoOscuro ? 'hover:bg-zinc-700' : 'hover:bg-zinc-200'}`}>
                        <X size={20} color={modoOscuro ? 'white' : 'black'}/>
                    </TouchableOpacity>
                </View>

                <View className="mb-6">
                    <Text className={`mb-2 ${modoOscuro ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        URL de Ngrok
                    </Text>
                    <TextInput
                        className={`border rounded-xl p-4 text-base ${modoOscuro ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                        placeholder="https://tu-url.ngrok-free.app"
                        placeholderTextColor={modoOscuro ? '#52525b' : '#94a3b8'}
                        value={urlOllama}
                        onChangeText={setUrlOllama}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                    <Text className={`mt-2 text-sm ${modoOscuro ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        Pega aquí el enlace de ngrok. La app agregará el /api/chat automáticamente.
                    </Text>
                    
                </View>

                <TouchableOpacity
                    onPress={alCerrar}
                    className= "bg-yellow-400 p-4 rounded-xl items-center mt-auto mb-4"
                >
                    <Text className="text-black font-bold text-base">
                        Guardar configuración
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  );
}
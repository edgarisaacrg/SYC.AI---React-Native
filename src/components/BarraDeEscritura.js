import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Paperclip, Send } from 'lucide-react-native';

export default function BarraDeEscritura({modoOscuro, alEnviar}) {
    const [texto, setTexto] = React.useState('');
    const manejarEnvio = () => {
        if (texto.trim() === '') return;
        alEnviar(texto);
        setTexto('');
    };

    return (
        <View className={`p-4 border-t ${modoOscuro ? 'bg-zinc-950' : 'bg-white border-slate-200'}`}>
            <View className="flex-row items-center gap-2 rounded-full p-2 pl-4 border shadow-sm
            ${modoOscuro ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>">
                
                {/* Botón de Adjuntar */}
                <TouchableOpacity className="p-1">
                    <Paperclip size={20} color={modoOscuro ? '#a1a1aa' : '#64748b'}/>
                </TouchableOpacity>

                {/* Caja de Texto */}
                <TextInput 
                value={texto} 
                onChangeText={setTexto} 
                placeholder="Escribe un mensaje..."
                placeholderTextColor={modoOscuro ? '#71717a' : '#94a3b8'}
                className="flex-1 text-sm"
                style={{ color: modoOscuro ? '#f4f4f5' : '#0f172a' }}
                returnKeyType='send'
                onSubmitEditing={manejarEnvio}
                />

                {/* Boton de Enviar */}
                <TouchableOpacity 
                onPress={manejarEnvio}
                disabled={texto.trim() === ''} 
                className={`p-2.5 rounded-full items-center justify-center 
                  ${texto.trim() !== '' 
                    ? 'bg-yellow-400' 
                    : modoOscuro ? 'bg-zinc-800' : 'bg-slate-200'}`}
                >
                    <Send size={16} color={texto.trim() !== '' ? '#000' : modoOscuro ? '#52525b' : '#cbd5e1'}
                    />
                    
                </TouchableOpacity>

            </View>
        </View>
    );
}
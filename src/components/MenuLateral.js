import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { MessageSquare, Plus, X, ChevronRight } from 'lucide-react-native';

const anchoPantalla = Dimensions.get('window').width;
const anchoMenu = anchoPantalla * 0.8;

export default function MenuHistorial({ 
  visible, 
  alCerrar, 
  modoOscuro, 
  historialFalso,
  alPresionarNuevoChat,
  alPresionarChat
}) {
  
  const animacionX = useRef(new Animated.Value(-anchoMenu)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(animacionX, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animacionX, {
        toValue: -anchoMenu,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={alCerrar}
    >
      <View className="flex-1 flex-row">
        
        <Animated.View 
          style={{ transform: [{ translateX: animacionX }] }}
          className={`h-full p-5 pt-12 shadow-2xl ${modoOscuro ? 'bg-zinc-900' : 'bg-white'}`}
          width={anchoMenu} 
        >

          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-xl font-bold ${modoOscuro ? 'text-zinc-100' : 'text-slate-800'}`}>
              Tus Chats
            </Text>
            <TouchableOpacity 
            onPress={alCerrar} 
            className={`p-2 rounded-full ${modoOscuro ? 'bg-zinc-800' : 'bg-slate-100'}`}>
              <X size={20} color={modoOscuro ? '#a1a1aa' : '#64748b'} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={alPresionarNuevoChat}
            className={`flex-row items-center gap-3 p-4 rounded-xl mb-6 border active:scale-95 transition-all
              ${modoOscuro ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}
          >
            <View className="bg-yellow-400 p-1 rounded-lg">
              <Plus size={18} color="#000" />
            </View>
            <Text className={`font-semibold ${modoOscuro ? 'text-zinc-200' : 'text-slate-700'}`}>
              Nueva Conversación
            </Text>
          </TouchableOpacity>

          <Text className={`text-xs font-bold tracking-wider mb-3 ml-1 ${modoOscuro ? 'text-zinc-500' : 'text-slate-400'}`}>
            HISTORIAL
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {historialFalso.map((chat) => (
              <TouchableOpacity 
              key={chat.id} 
              onPress={() => alPresionarChat(chat.id)}
              className={`flex-row items-center justify-between p-3 mb-2 rounded-lg ${modoOscuro ? 'active:bg-zinc-800' : 'active:bg-slate-100'}`}>
                <View className="flex-row items-center gap-3 flex-1 pr-4">
                  <MessageSquare size={18} color={modoOscuro ? '#71717a' : '#94a3b8'} />
                  <Text numberOfLines={1} className={`text-sm ${modoOscuro ? 'text-zinc-300' : 'text-slate-600'}`}>{chat.titulo}</Text>
                </View>
                <ChevronRight size={16} color={modoOscuro ? '#52525b' : '#cbd5e1'} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <TouchableOpacity className="flex-1 bg-black/60" activeOpacity={1} onPress={alCerrar} />
        
      </View>
    </Modal>
  );
}
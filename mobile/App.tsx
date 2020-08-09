import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Landing from './src/pages/Landing'
import { AppLoading } from 'expo'

//importante importar o useFonts de uma das importações de fontes
import { Archivo_400Regular, Archivo_700Bold, useFonts } from '@expo-google-fonts/archivo'
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins'

import AppStack from './src/routes/AppStack';

export default function App() {
  let [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold
  })

  //validando se a fonte ja foi carregada
  if (!fontsLoaded) {
    return <AppLoading /> //tela de carregamento
  }else {
    return (
      //criando um fragmento para poder trabalhar com duas importações juntas
      <> 
        <AppStack />
        <StatusBar style="light" />
      </>
    );
  }
}
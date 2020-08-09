import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import TeacherList from '../pages/TeacherList'
import Favorites from '../pages/Favorites'

const { Navigator, Screen } = createBottomTabNavigator()

function StudyTabs() {
    return (
        <Navigator
            //estilização das abas inferiores
            tabBarOptions={{
                //estrutura da aba
                style: {
                    elevation: 0, //sombra (Android)
                    shadowOpacity: 0, //sombra (IOS)
                    height: 64,
                },

                //cada aba
                tabStyle: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                },

                //icones
                iconStyle: {
                    flex: 0,
                    width: 20,
                    height: 20,
                },

                //texto
                labelStyle: {
                    fontFamily: 'Archivo_700Bold',
                    fontSize: 13,
                    marginLeft: 16
                },

                //aba não selecionada
                inactiveBackgroundColor: '#fafafc',
                inactiveTintColor: '#c1bccc',
                //aba selecionada
                activeBackgroundColor: '#ebebf5',
                activeTintColor: '#32264d'
            }}        
        >
            <Screen 
                name="TeacherList" 
                component={TeacherList}
                options={{
                    tabBarLabel: 'Proffys', //texto que é mostrado na aba
                    tabBarIcon: ({color, size, focused }) => {
                        return (
                            <Ionicons name="ios-easel" size={size} color={focused ? '#8257e7' : color} />
                        )
                    }
                }} 
            />
            <Screen 
                name="Favorites" 
                component={Favorites} 
                options={{
                    tabBarLabel: 'Favoritos', //texto que é mostrado na aba
                    tabBarIcon: ({color, size, focused}) => {
                        return (
                            <Ionicons name="ios-heart" size={size} color={focused ? '#8257e7' : color} />
                        )
                    }
                }} 
            />
        </Navigator>
    )
}

export default StudyTabs
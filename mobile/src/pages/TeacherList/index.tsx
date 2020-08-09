import React, { useState } from 'react'
import { View, ScrollView, TextInput, Text } from 'react-native'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage' 

import api from '../../services/api'

import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'

import style from './style'

function TeacherList() {
    const [teachers, setTeachers] = useState([])
    const [isFiltersVisible, setIsFiltersVisible] = useState(false)
    const [favorites, setFavorites] = useState<number[]>([])

    const [subject, setSubject] = useState('')
    const [week_day, setWeekDay] = useState('')
    const [time, setTime] = useState('')

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoriteList = JSON.parse(response)
                const favoriteTeacherId = favoriteList.map((teacher: Teacher) => {
                    return teacher.id
                })

                setFavorites(favoriteTeacherId)
            }
        })
    }

    useFocusEffect(() => {
        loadFavorites()
    })

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible) //seta o contrário do valor ja inserido no State
    }

    async function handleFiltersSubmit() {
        loadFavorites()

        const response = await api.get('/classes', {
            params: {
                week_day,
                subject,
                time
            }
        })

        setIsFiltersVisible(false)
        setTeachers(response.data)
    }

    return (
        <View style={style.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#fff" />
                    </BorderlessButton>
                )}
            >
                {isFiltersVisible && (
                    <View style={style.searchForm}>
                        <Text style={style.label}>Matéria</Text>
                        <TextInput
                            style={style.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder="Matéria"
                            placeholderTextColor='#c1bccc'
                        />

                        <View style={style.inputGroup}>
                            <View style={style.inputBlock}>
                                <Text style={style.label}>Dia da semana</Text>
                                <TextInput
                                    style={style.input}
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    placeholder="Qual o dia?"
                                    placeholderTextColor='#c1bccc'
                                />
                            </View>

                            <View style={style.inputBlock}>
                                <Text style={style.label}>Horário</Text>
                                <TextInput
                                    style={style.input}
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholder="Qual o horário?"
                                    placeholderTextColor='#c1bccc'
                                />
                            </View>
                        </View>

                        <RectButton
                            onPress={handleFiltersSubmit}
                            style={style.submitButton}
                        >
                            <Text style={style.submitButtonText}>
                                Filtrar
                            </Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={style.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default TeacherList
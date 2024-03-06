import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    Alert,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    ScrollView,
    Image,
    TextInput,
    Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dogs = () => {
    const [dogsList, setDogsList] = useState({ list: null, error: false })
    const [imageDog, setImageDog] = useState({ imageUrl: '', error: false })
    const [picker, setPicker] = useState(true)

    const [name, setName] = useState('')
    const [color, setColor] = useState('')
    const [age, setAge] = useState('')
    const [height, setHeight] = useState('')
    const [breed, setBreed] = useState('')
    const [localImage, setLocalImage] = useState('')

    const [search, setSearch] = useState('')
    const [json, setJson] = useState({ dog: { name: name, color: color, age: age, height: height, breed: breed, localImage: localImage, dogList: dogsList.list}})
    const [list, setList] = useState(json)
    const [teste2, setTeste2] = useState([{dado: teste2}])


    const fetchallBreeds = async () => {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all')

            if (response.ok) {
                const data = await response.json()
                setDogsList({ list: Object.keys(data.message) })
                // await AsyncStorage.setItem('@list', breed)

            } else {
                setDogsList({ error: true })
                alert('Erro, atualize a página.')
            }

        } catch (e) {
            setDogsList({ error: true })
        }

    }

    const changeImage = async (item) => {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${item}/images/random`)

            if (response.ok) {
                const data = await response.json()
                const imageUrl = data.message
                setImageDog({ imageUrl: imageUrl })
                setPicker(true)
                setBreed(item)
                setLocalImage(imageUrl)
            } else {
                setImageDog({ error: true })
                alert('Erro, atualize a página.')
            }

        } catch (e) {
            setImageDog({ error: true })
        }

        console.log('item aqui:', data)
    } 

    useEffect(async () => {
       
        await fetchallBreeds()
        getData()
        console.log(json.dog)
        if(search === ''){
            setList(json)
        } else {
            setList(
                json.filter((item) => {
                    if(item.name.indexOf(search) > -1){
                        return true
                    } else {
                        return false
                    }
                })
            )
        }
        // await AsyncStorage.getItem('@list', breed)
    }, [search])

    async function handleAsync(){
        await AsyncStorage.setItem('@list', name)

        await AsyncStorage.setItem('@list2', color)

        await AsyncStorage.setItem('@list3', age)

        await AsyncStorage.setItem('@list4', height)

        await AsyncStorage.setItem('@list5', breed)

        await AsyncStorage.setItem('@list7', localImage)

        getData()
    }

    async function getData(){
        const response = await AsyncStorage.getItem('@list')
        if(response){
            setName(response)
            setJson({ dog: response})
        }
        const response2 = await AsyncStorage.getItem('@list2')
        if(response2){
            setColor(response2)
        }
        const response3 = await AsyncStorage.getItem('@list3')
        if(response3){
            setAge(response3)
        }
        const response4 = await AsyncStorage.getItem('@list4')
        if(response4){
            setHeight(response4)
        }
        const response5 = await AsyncStorage.getItem('@list5')
        if(response5){
            setBreed(response5)
        }
        const response7 = await AsyncStorage.getItem('@list7')
        if(response7){
            setLocalImage(response7)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centralContainer}>
                <TouchableOpacity>
                    <Text style={styles.title}>Escolha o seu doguinho</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.setBox} onPress={() => {handleAsync()}}>
                    <Text style={styles.textSet}>Clique aqui para cadastrar seu doguinho</Text>
                </TouchableOpacity>
                <FlatList
                    style={styles.scroll}
                    keyExtractor={(index) => `${index}`}
                    data={dogsList.list}
                    renderItem={({ item }) => (
                        <View style={styles.scroll} >
                            {
                                picker ? (
                                    <View style={styles.center}>
                                            <View  style={styles.picker}>
                                            <Text style={styles.textPicker}>{teste2.dado}</Text>
                                        </View>
                                        <View  style={styles.picker}>
                                            <Text style={styles.textPicker}>Qual o nome?</Text>
                                        </View>
                                        <TextInput 
                                            placeholder="..."
                                            value={name}
                                            placeholderTextColor={'#fff'}
                                            onChangeText={(text) => { setName(text)}}
                                            style={styles.input}
                                        />
                                      <View style={styles.picker}>
                                            <Text style={styles.textPicker}>Qual a cor?</Text>
                                        </View>
                                        <TextInput 
                                            placeholder="..."
                                            value={color}
                                            placeholderTextColor={'#fff'}
                                            onChangeText={(text) => {setColor(text)}}
                                            style={styles.input}
                                        />
                                          <View style={styles.picker}>
                                            <Text style={styles.textPicker}>Qual o tamanho?</Text>
                                        </View>
                                        <TextInput 
                                            placeholder="..."
                                            value={height}
                                            placeholderTextColor={'#fff'}
                                            onChangeText={(text) => {setHeight(text)}}
                                            style={styles.input}
                                        />
                                          <View style={styles.picker}>
                                            <Text style={styles.textPicker}>Qual a idade do doguinho?</Text>
                                        </View>
                                        <TextInput 
                                            placeholder="..."
                                            value={age}
                                            placeholderTextColor={'#fff'}
                                            onChangeText={(text) => {setAge(text)}}
                                            style={styles.input}
                                        />
                                        <TouchableOpacity onPress={() => { setPicker(!picker) }} style={styles.picker}>
                                            <Text style={styles.textPicker}>Escolha a raça</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.textPicker}>{breed}</Text>


                                        {/* <TouchableOpacity onPress={() => {handleAsync()}} style={styles.picker}>
                                            <Text style={styles.textPicker}>{value}</Text>
                                        </TouchableOpacity>
                                        <TextInput 
                                            placeholder="..."
                                            value={inputValue}
                                            onChangeText={(text) => {setInputValue(text)}}
                                            style={styles.input}
                                        /> */}


                                        {
                                            localImage == '' ?
                                                (
                                                    <View style={styles.box}>
                                                        <Text style={styles.textPicker}>?</Text>
                                                    </View> ) : (
                                                        <>
                                                    <Image
                                                        source={{ uri: localImage }}
                                                        style={{ height: 200, width: 200, borderRadius: 20, }}
                                                    />
                                                    </>
                                                )}
                                    </View>
                                ) : (
                                    <View>
                                        <View style={styles.header}>

                                        </View>
                                        {
                                            dogsList.list.map((item, index) => {
                                                return (
                                                    <TouchableOpacity key={index} onPress={() => { changeImage(item) }} style={styles.itemContainer}>
                                                        <Text style={styles.text} >
                                                            {`${item}`}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                )
                            }


                        </View>
                    )}
                />

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#d97706',
    },
    centralContainer: {
        backgroundColor: '#d97706',
    },
    title: {
        paddingVertical: 8,
        borderRadius: 6,
        color: '#fff',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 20
    },
    text: {
        paddingVertical: 8,
        borderRadius: 6,
        color: '#fff',

        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 20
    },
    scroll: {
        backgroundColor: '#1f2937',
        height: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 10,
        paddingTop: 20
    },
    header: {
        marginVertical: 5,
        alignItems: 'center',
        marginHorizontal: 20
    },
    itemContainer: {
        backgroundColor: '#171717',
        marginVertical: 5,
        marginHorizontal: 20
    },
    picker: {
        marginVertical: 5,
        alignItems: 'center',
        marginHorizontal: 20
    },
    textPicker: {
        paddingVertical: 8,
        borderRadius: 6,
        color: '#d97706',

        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 20
    },
    box: {
        width: 200,
        height: 200,
        borderRadius: 20,
        backgroundColor: '#171717',
        alignItems: 'center',
        justifyContent: 'center'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        color: '#fff',
        height: 30,
        fontSize: 20,
        borderColor: '#fff',
        borderWidth: 1,
        width: '50%',
        borderRadius: 5,
        marginVertical: 10
    },
    textSet: {
        paddingVertical: 8,
        borderRadius: 6,
        color: '#fff',
        backgroundColor: '#171717',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 20
    },
    setBox: {
        borderRadius: 20,
        color: '#fff',
        backgroundColor: '#171717',
        marginHorizontal: 20,

    }

});

export default Dogs;

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
    const [isBox, setIsBox] = useState(false)
    const [searchInput, setSearchInput] = useState('');
    const [valoresNitidos, setValoresNitidos] = useState([]);

    useEffect(() => {
        getNitidosAsync();
    }, []);

    // Função para adicionar mais um valor nitido
    const adicionarValorNitido = async (name, color, age, height, localImage, breed) => {
        await handleAsync()
        setValoresNitidos(prevValoresNitidos => [
            ...prevValoresNitidos,
            { name: name, color: color, age: age, height: height, localImage: localImage, breed: breed }
        ]);
    };

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
    }, [])

    async function handleAsync() {
        await AsyncStorage.setItem('@list', name)

        await AsyncStorage.setItem('@list2', color)

        await AsyncStorage.setItem('@list3', age)

        await AsyncStorage.setItem('@list4', height)

        await AsyncStorage.setItem('@list5', breed)

        await AsyncStorage.setItem('@list7', localImage)

        await AsyncStorage.setItem('@valoresNitidos', JSON.stringify(valoresNitidos));
        console.log('valor guardado', JSON.stringify(valoresNitidos))

        getData()
    }

    const handleNitidosAsync = async (name, color, age, height, localImage, breed) => {
        try {
            const novoValor = { name, color, age, height, localImage, breed };
            const valoresAntigos = await AsyncStorage.getItem('@valoresNitidos');
            const valoresAntigosArray = valoresAntigos ? JSON.parse(valoresAntigos) : [];
            const novosValores = [...valoresAntigosArray, novoValor];
            await AsyncStorage.setItem('@valoresNitidos', JSON.stringify(novosValores));
            setValoresNitidos(novosValores);
        } catch (error) {
            console.error('Erro ao salvar os valores nitidos:', error);
        }
        setIsBox(!isBox)
    };

    const getNitidosAsync = async () => {
        try {
            const valoresSalvos = await AsyncStorage.getItem('@valoresNitidos');
            if (valoresSalvos) {
                setValoresNitidos(JSON.parse(valoresSalvos));
            }
        } catch (error) {
            console.error('Erro ao obter os valores nitidos:', error);
        }
    };

    async function getData() {
        const response = await AsyncStorage.getItem('@list')
        if (response) {
            setName(response)
        }
        const response2 = await AsyncStorage.getItem('@list2')
        if (response2) {
            setColor(response2)
        }
        const response3 = await AsyncStorage.getItem('@list3')
        if (response3) {
            setAge(response3)
        }
        const response4 = await AsyncStorage.getItem('@list4')
        if (response4) {
            setHeight(response4)
        }
        const response5 = await AsyncStorage.getItem('@list5')
        if (response5) {
            setBreed(response5)
        }
        const response7 = await AsyncStorage.getItem('@list7')
        if (response7) {
            setLocalImage(response7)
        }


    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centralContainer}>
                <TouchableOpacity>
                    <Text style={styles.title}>Escolha o seu doguinho</Text>
                </TouchableOpacity>


                {
                    isBox ?
                        (<ScrollView style={styles.scroll}>
                            <View>
                                <TouchableOpacity onPress={() => {setIsBox(!isBox)}}>
                                    <Text style={styles.textPicker}>Voltar</Text>
                                </TouchableOpacity>
                           
                                <Text style={styles.textPicker}>Doguinho Cadastrado:</Text>
                                <View style={{alignItems: 'center'}}>
                                    <TextInput
                                        placeholder="Pesquisar..."
                                        value={searchInput}
                                        placeholderTextColor={'#fff'}
                                        onChangeText={text => setSearchInput(text)}
                                        style={styles.input}
                                    />
                                </View>
                               
                                <View style={styles.content}>
                                    <FlatList
                                        style={styles.scroll}
                                        keyExtractor={(item, index) => index.toString()}
                                        data={valoresNitidos.filter(item =>
                                            (item.name && item.name.toLowerCase().includes(searchInput.toLowerCase())) ||
                                            (item.color && item.color.toLowerCase().includes(searchInput.toLowerCase())) ||
                                            (item.age && item.age.toLowerCase().includes(searchInput.toLowerCase())) ||
                                            (item.height && item.height.toLowerCase().includes(searchInput.toLowerCase())) ||
                                            (item.breed && item.breed.toLowerCase().includes(searchInput.toLowerCase()))
                                        )}
                                        renderItem={({ item, index }) => (
                                            <View style={styles.itemContainer}>
                                                <Text style={styles.text}>{`Nome: ${item.name}`}</Text>
                                                <Text style={styles.text}>{`Cor: ${item.color}`}</Text>
                                                <Text style={styles.text}>{`Idade: ${item.age}`}</Text>
                                                <Text style={styles.text}>{`Tamanho: ${item.height}`}</Text>
                                                <Text style={styles.text}>{`Espécie: ${item.breed}`}</Text>
                                                <Image source={{ uri: item.localImage }} style={{ width: 100, height: 100, marginLeft: 20, marginBottom: 20, borderRadius: 10 }} />
                                            </View>
                                        )}
                                    />

                                </View>
                            </View>
                        </ScrollView>) : (
                            <FlatList
                                style={styles.scrollMain}
                                keyExtractor={(index) => `${index}`}
                                data={dogsList.list}
                                renderItem={({ item }) => (
                                    <View style={styles.scroll} >
                                        {
                                            picker ? (
                                                <View style={styles.center}>
                                                    <TouchableOpacity style={styles.setBox} onPress={() => handleNitidosAsync(name, color, age, height, localImage, breed)}>
                                                        <Text style={styles.textSet}>Clique aqui para ver seu doguinho</Text>
                                                    </TouchableOpacity>
                                                    <View style={styles.picker}>
                                                        <Text style={styles.textPicker}>Qual o nome?</Text>
                                                    </View>
                                                    <TextInput
                                                        placeholder="..."
                                                        value={name}
                                                        placeholderTextColor={'#fff'}
                                                        onChangeText={(text) => { setName(text) }}
                                                        style={styles.input}
                                                    />
                                                    <View style={styles.picker}>
                                                        <Text style={styles.textPicker}>Qual a cor?</Text>
                                                    </View>
                                                    <TextInput
                                                        placeholder="..."
                                                        value={color}
                                                        placeholderTextColor={'#fff'}
                                                        onChangeText={(text) => { setColor(text) }}
                                                        style={styles.input}
                                                    />
                                                    <View style={styles.picker}>
                                                        <Text style={styles.textPicker}>Qual o tamanho?</Text>
                                                    </View>
                                                    <TextInput
                                                        placeholder="..."
                                                        value={height}
                                                        placeholderTextColor={'#fff'}
                                                        onChangeText={(text) => { setHeight(text) }}
                                                        style={styles.input}
                                                    />
                                                    <View style={styles.picker}>
                                                        <Text style={styles.textPicker}>Qual a idade do doguinho?</Text>
                                                    </View>
                                                    <TextInput
                                                        placeholder="..."
                                                        value={age}
                                                        placeholderTextColor={'#fff'}
                                                        onChangeText={(text) => { setAge(text) }}
                                                        style={styles.input}
                                                    />
                                                    <TouchableOpacity onPress={() => { setPicker(!picker) }} style={styles.pickerBreed}>
                                                        <Text style={styles.textPicker}>Escolha a raça</Text>
                                                    </TouchableOpacity>
                                                    <Text style={styles.textPicker}>{breed}</Text>
                                                    {
                                                        localImage == '' ?
                                                            (
                                                                <View style={styles.box}>
                                                                    <Text style={styles.textPicker}>?</Text>
                                                                </View>) : (
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

                        )
                }


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
        paddingTop: 20,
        borderRadius: 20,
        marginBottom: 150
    },
    scrollMain: {
        backgroundColor: '#1f2937',
        height: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 10,
        paddingTop: 20,
        borderRadius: 20,
        marginBottom: 300
    },
    header: {
        marginVertical: 5,
        alignItems: 'center',
        marginHorizontal: 20
    },
    itemContainer: {
        backgroundColor: '#171717',
        marginVertical: 5,
        marginHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 20,
        justifyContent: 'center',
    },
    picker: {
        marginVertical: 5,
        alignItems: 'center',
        marginHorizontal: 30,
    },
    pickerBreed: {
        marginVertical: 5,
        alignItems: 'center',
        marginHorizontal: 30,
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
        borderRadius: 20

    }

});

export default Dogs;

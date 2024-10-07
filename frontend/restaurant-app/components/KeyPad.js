import { StyleSheet, Text, View, Pressable, } from 'react-native'
import React from 'react'


const KeyPad = ({setPhoneNumber}) => {

    const handleKeyPress = (value) => {
        setPhoneNumber((prev) => prev + value);
    };

    const handleDelete = () => {
        setPhoneNumber((prev) => prev.slice(0, -1));
    };


    return (
        <View style={styles.keypad}>
                <View style={styles.keypadRow}>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('1')}>
                        <Text style={styles.keyText}>1</Text>
                    </Pressable>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('2')}>
                        <Text style={styles.keyText}>2</Text>
                    </Pressable>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('3')}>
                        <Text style={styles.keyText}>3</Text>
                    </Pressable>
                </View>
                <View style={styles.keypadRow}>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('4')}>
                        <Text style={styles.keyText}>4</Text>
                    </Pressable>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('5')}>
                        <Text style={styles.keyText}>5</Text>
                    </Pressable>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('6')}>
                        <Text style={styles.keyText}>6</Text>
                    </Pressable>
                </View>
                <View style={styles.keypadRow}>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('7')}>
                        <Text style={styles.keyText}>7</Text>
                    </Pressable>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('8')}>
                        <Text style={styles.keyText}>8</Text>
                    </Pressable>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('9')}>
                        <Text style={styles.keyText}>9</Text>
                    </Pressable>
                </View>
                <View style={styles.lastKeypadRow}>
                    <Pressable style={styles.key} onPress={() => handleKeyPress('0')}>
                        <Text style={styles.keyText}>0</Text>
                    </Pressable>
                    <Pressable style={styles.key} onPress={handleDelete}>
                        <Text style={styles.keyText}>⌫</Text>
                    </Pressable>
                </View>
            </View>
    )
}

export default KeyPad

const styles = StyleSheet.create({
    keypad: {
        width: "100%",
    },
    keypadRow: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 10,
    },
    lastKeypadRow:{
        flexDirection: 'row',
        gap: 2,
        marginBottom: 10,
        justifyContent: "flex-end"
    },
    key: {
        width: '33%',
        padding: 15,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    keyText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
})
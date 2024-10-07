import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback} from 'react-native';
import KeyPad from '../components/KeyPad';
import validator from 'validator';
import { countryData } from '../assets/data/data';
import CountryFlag from "react-native-country-flag";
import ErrorComponent from '../components/ErrorComponent';

const PhoneNumberScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState(countryData.no);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorKey, setErrorKey] = useState(0)

    const testPhoneNumber = 95819642

    const filteredCountries = Object.keys(countryData).filter((key) =>
        countryData[key].name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNext = () => {
        
        const fullPhoneNumber = `${countryCode.dial_code}${phoneNumber}`;
        if (validator.isMobilePhone(fullPhoneNumber, countryCode.country_code)) {
            navigation.navigate('Payment', { phoneNumber: fullPhoneNumber });
        } else {
            setShowError(true);
            setErrorKey(prevKey => prevKey + 1);
        }
    };

    const handleCountryChange = (country) => {
        setCountryCode(country);
        setModalVisible(false);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Write Your Phone Number</Text>
            
            
           
            <View style={styles.inputContainer}>
                <TouchableOpacity 
                    style={styles.flagContainer} 
                    onPress={() => setModalVisible(true)}
                >
                    <CountryFlag isoCode={countryCode.flag} size={18}/>
                    <Text style={styles.dialCode}>{countryCode.dial_code}</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    editable={false}
                />
            </View>

            <Pressable onPress={() => setPhoneNumber(testPhoneNumber)}>
                <Text style={styles.testNumberBtn}>Use Test Number</Text>
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                
                <View style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search country"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((key) => {
                                const country = countryData[key];
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        style={styles.countryItem}
                                        onPress={() => handleCountryChange(country)}
                                    >

                                        <Text style={styles.flag}>
                                            <CountryFlag isoCode={country.flag} size={18} style={{marginRight: "15px"}}/>
                                            {country.name}
                                        </Text>
                                        <Text style={styles.dialCode}>{country.dial_code}</Text>
                                    </TouchableOpacity>
                                );
                            })
                        ):(
                            <Text style={styles.noResultsText}>No countries found</Text>
                        )}
                        </ScrollView>
                    </View>
                </View>
                
            </Modal>

            <View style={styles.keypadContainer}>
                <View style={styles.keypad}>
                    <KeyPad setPhoneNumber={setPhoneNumber} />
                </View>
            </View>

            <Pressable 
                style={styles.nextButton}
                onPress={handleNext}
            >
                <Text style={styles.buttonText}>Next</Text>
            </Pressable>

            {showError && <ErrorComponent message="Type in valid phone number!" resetKey={errorKey}/>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFEBCD',
    },
    scrollViewContent: {
        paddingVertical: 10,
    },
    testNumberBtn: {
        textAlign: "center",
        fontSize: 16,
        color: "#FF6347",
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "center",
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: "#fff",
        width: "30%"
    },
    input: {
        flex: 1,
        padding: 10,
        
    },
    flagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        padding: 5,
        marginRight: 10,
        borderRightWidth: 1,
        borderRightColor: "black",
    },
    flag: {
        fontSize: 18,
        alignSelf: "center",
        textAlign: "center"
    },
    dialCode: {
        fontSize: 18,
        marginLeft: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '50%',
        height: '50%',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    countryItem: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    countryCode: {
        marginLeft: 10,
        fontSize: 14,
    },

    nextButton: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    keypadContainer: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        // backgroundColor: "#fff",
        // padding: 15,
        width: "30%",
        borderRadius: 20,
    },
    keypad: {
        width: "90%",
        alignItems: "center",
        justifyContent: "center"
    },
    searchInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
    },
    
});

export default PhoneNumberScreen;

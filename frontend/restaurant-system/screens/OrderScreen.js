import { StyleSheet, Text, View, Pressable, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchOrdersFromAPI } from '../service/api/ordersService';
import { Audio } from 'expo-av';
import * as Print from 'expo-print';
import moment from 'moment/moment';
import styled from 'styled-components/native';

const StatusTab = ({color, label, count}) => {
    <TabContainer>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{label}</Text>
        <Text style={{ color: '#fff'}}>{count}</Text>
    </TabContainer>
}

const OrderCard = ({orderNumber, time, total,}) => {
    <Card>
        <Text>{time}</Text>
        <Text>{orderNumber}</Text>
        <Text>{total}</Text>

        <Pressable style={styles.button}>
            <Text>See order</Text>
        </Pressable>
    </Card>
}

const OrderColumn = ({ title, color, children }) => (
    <ColumnContainer>
        <ColumnHeader backgroundColor={color}>
            <Text style={styles.columnTitle}>{title}</Text>
        </ColumnHeader>
        {children}
    </ColumnContainer>
);

const Header = styled.View`
    background-color: #333;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StatusTabs = styled.View`
    flex-direction: row;
    justify-content: space-around;
    margin-top: 10px;
`;

const TabContainer = styled.View`
    background-color: ${(props) => props.backgroundColor};
    padding: 10px;
    border-radius: 5px;
    width: 100px;
    justify-content: center;
    align-items: center;
`;

const OrdersContainer = styled.View`
    padding: 20px;
    flex-direction: row;
    justify-content: space-between;
`;

const ColumnContainer = styled.View`
    flex: 1;
    margin: 0 10px;
`;

const ColumnHeader = styled.View`
    background-color: ${(props) => props.backgroundColor};
    padding: 10px;
    border-radius: 5px;
`;

const Card = styled.View`
    background-color: #fff;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
`;

const OrderScreen = ({orders, }) => {
    

    

    return (
        <View style={styles.container}>
            
        </View>
    )
}


export default OrderScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },

    time: {
        color: '#fff',
        fontSize: 18,
    },
    columnTitle: {
        fontWeight: 'bold',
        color: '#fff',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 5,
        borderRadius: 5,
        textAlign: 'center',
    },
    
    
})
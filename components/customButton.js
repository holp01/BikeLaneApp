import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function CustomButton({ label, onPress, bkColor, textColor }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: bkColor,
                padding: 20,
                borderRadius: 10,
                marginBottom: 30,
            }}>
            <Text
                style={{
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: 16,
                    color: textColor,
                }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function InputField({
    label,
    icon,
    inputType,
    keyboardType,
    fieldButtonLabel,
    fieldButtonFunction,
    fieldOnChangeText
}) {
    return (
        <View
            style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 25,
            }}>
            {icon}
            {inputType == 'password' ? (
                <TextInput
                    placeholder={label}
                    keyboardType={keyboardType}
                    style={{ flex: 1, paddingVertical: 0 }}
                    secureTextEntry={true}
                    onChangeText={fieldOnChangeText}
                />
            ) : (
                <TextInput
                    placeholder={label}
                    keyboardType={keyboardType}
                    style={{ flex: 1, paddingVertical: 0 }}
                    onChangeText={fieldOnChangeText}
                />
            )}
            <TouchableOpacity onPress={fieldButtonFunction}>
                <Text style={{ color: '#FF4040', fontWeight: '700' }}>{fieldButtonLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}
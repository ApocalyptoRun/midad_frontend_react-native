import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/themes';
import React from 'react';

const Button = (props) => {
  return (
    <TouchableOpacity
        style={{ ...styles.btn, ...props.style}}
        onPress={props.onPress}
    >
        <Text style={{
            ...FONTS.body2,
            //fontFamily: 'Semibold',
            color: COLORS.white
        }}>{props.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    btn: {
        width: SIZES.width - 32,
        paddingVertical: SIZES.padding,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: '#4E73DE',
    }
})

export default Button

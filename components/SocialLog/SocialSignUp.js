import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { wp } from '../../utils/helpers';
import { GlobalStyles } from '../../constants/Styles';

const SocialSignUp = ({ children, title ,onPress}) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.iconContainer}>
                {children}  
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>  
            </View>
        </Pressable>
    );
};

export default SocialSignUp;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: GlobalStyles.colors.primary1,
        borderColor: GlobalStyles.colors.primary1,
        marginBottom: 10,
    },
    iconContainer: {
        justifyContent: 'flex-start',  
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,  
        justifyContent: 'center',  
        alignItems: 'center',  
        
    },
    title: {
        textAlign: 'center',
        color:GlobalStyles.colors.primary2, 
    }
});

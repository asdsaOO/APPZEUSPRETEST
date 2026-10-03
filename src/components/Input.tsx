
import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';

type InputProps = TextInputProps;

export function Input(props: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        focused && styles.containerFocused,
      ]}
    >
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="#8A8A8A"
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderWidth: 1.5,
    borderColor: '#D5D9DE',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',

    paddingHorizontal: 16,

    justifyContent: 'center',

    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 2,
  },

  containerFocused: {
    borderColor: colors.quaternary,
    borderWidth: 2,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#222222',
  },
});

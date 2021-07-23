import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Checkbox({
  checked,
  onChange,
  buttonStyle = null,
  activeButtonStyle = null,
  inactiveButtonStyle = {},
  activeIconProps = {},
  inactiveIconProps = {},
}) {
  function onCheckmarkPress() {
    onChange(!checked);
  }

  const buttonBaseStyle = buttonStyle
    ? buttonStyle
    : defaultStyles.checkboxBase;

  const buttonActiveStyle = activeButtonStyle
    ? activeButtonStyle
    : defaultStyles.checkboxChecked;

  const iconProps = checked ? activeIconProps : inactiveIconProps;
  return (
    <Pressable
      style={[
        buttonBaseStyle,
        checked ? buttonActiveStyle : inactiveButtonStyle,
      ]}
      onPress={onCheckmarkPress}
    >
      {checked && (
        <Ionicons name="checkmark" size={24} color="white" {...iconProps} />
      )}
    </Pressable>
  );
}

const defaultStyles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "coral",
    backgroundColor: "transparent",
  },

  checkboxChecked: {
    backgroundColor: "coral",
  },
});

export default Checkbox;

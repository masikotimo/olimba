import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const KEYBOARD_EXTRA_SCROLL = 24;

const KeyboardAwareFormScroll = ({
  children,
  style,
  contentContainerStyle,
  extraScrollHeight = KEYBOARD_EXTRA_SCROLL,
  ...rest
}) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      style={style}
      contentContainerStyle={[
        { paddingBottom: Math.max(insets.bottom, 16) + KEYBOARD_EXTRA_SCROLL },
        contentContainerStyle,
      ]}
      enableOnAndroid
      enableAutomaticScroll
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      extraScrollHeight={extraScrollHeight}
      extraHeight={extraScrollHeight}
      {...rest}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardAwareFormScroll;

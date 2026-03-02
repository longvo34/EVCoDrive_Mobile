import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import EVLoading from "../../../../components/animation/EVLoading";
import COLORS from "../../../../constants/colors";
import styles from "./UtilitiesScreen.styles";

function AnimatedItem({ children, index }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();

  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }], width: "30%" }}>
      {children({ onPressIn, onPressOut })}
    </Animated.View>
  );
}

export default function UtilitiesScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleChatPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("ChatGroup");
    }, 600);
  };

  const renderItem = ({
    icon,
    label,
    onPress,
    disabled = false,
    iconType = "ion",
    danger = false,
    index = 0,
  }) => {
    const iconColor = danger
      ? "#EF4444"
      : disabled
      ? "#BABAC8"
      : COLORS.softGreen ?? "#34A853";

    return (
      <AnimatedItem key={label} index={index}>
        {({ onPressIn, onPressOut }) => (
          <TouchableOpacity
            style={[
              styles.item,
              disabled && { opacity: 0.55 },
            ]}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled}
            activeOpacity={1}
          >
            <View
              style={[
                styles.iconWrapper,
                disabled && styles.disabledIcon,
                danger && styles.dangerIcon,
              ]}
            >
              {iconType === "ion" ? (
                <Ionicons name={icon} size={24} color={iconColor} />
              ) : (
                <MaterialIcons name={icon} size={24} color={iconColor} />
              )}
            </View>

            <Text
              style={[
                styles.label,
                disabled && styles.labelDisabled,
              ]}
  
            >
              {label}
            </Text>
          </TouchableOpacity>
        )}
      </AnimatedItem>
    );
  };

  return (
    <View style={styles.container}>
      <EVLoading visible={loading} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="#1A1A2E" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tiện ích mở rộng</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* COMMUNITY */}
        <Text style={styles.sectionTitle}>CỘNG ĐỒNG & TIỆN ÍCH</Text>

        <View style={styles.grid}>
          {renderItem({
            icon: "chatbubble-outline",
            label: "Chat nhóm",
            onPress: handleChatPress,
            index: 0,
          })}

        </View>
      </ScrollView>
    </View>
  );
}
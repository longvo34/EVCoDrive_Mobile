import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EVLoading from "../../../../../components/animation/EVLoading";
import styles from "./SellRequestScreen.styles";

export default function SellRequestScreen({ navigation }) {
  const [percent, setPercent] = useState(20);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const showLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 700); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <EVLoading />}

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thiết lập bán</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* VEHICLE INFO */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleName}>VinFast VF 9 Plus</Text>
              <Text style={styles.vehicleSub}>Biển số: 30A-123.45</Text>
              <Text style={styles.vehicleSub}>Màu: Xám</Text>
            </View>
          </View>
        </View>

        {/* SUGGEST PRICE */}
        <TouchableOpacity
          style={styles.suggestBtn}
          onPress={showLoading}
        >
          <Ionicons name="sparkles-outline" size={16} />
          <Text style={styles.suggestText}>GỢI Ý GIÁ BÁN TỐI ƯU</Text>
        </TouchableOpacity>

        {/* SHARE SLIDER */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Bán {percent}% (2 phần)</Text>
            <Text style={styles.cardSub}>2/10 phần</Text>
          </View>

          <View style={styles.sliderTrack}>
            <View style={[styles.sliderActive, { width: `${percent}%` }]} />
            <View style={[styles.sliderDot, { left: `${percent - 2}%` }]} />
          </View>

          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>20%</Text>
            <Text style={styles.sliderLabel}>50%</Text>
            <Text style={styles.sliderLabel}>80%</Text>
          </View>

          <Text style={styles.sliderNote}>
            ⏱ 1 phần ≈ 10% giá trị xe
          </Text>
        </View>

        {/* PRICE INPUT */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Giá bán cho 1 phần (10%)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Nhập giá tiền"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
            <Text style={styles.currency}>VND</Text>
          </View>
        </View>

        {/* INFO BOX */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} />
          <Text style={styles.infoText}>
            Yêu cầu bán sẽ được đăng tối thiểu 30 ngày. Trong 7 ngày đầu, cổ phần
            được ưu tiên bán cho thành viên trong nhóm. Sau đó, hệ thống sẽ tự
            động mở bán công khai.
          </Text>
        </View>

        {/* EXPIRED DATE */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Thời gian hiển thị</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={18} />
            <Text style={styles.dateText}>Ngày kết thúc</Text>
          </View>
        </View>
      </ScrollView>

      {/* SUBMIT */}
      <TouchableOpacity
        style={styles.submitBtnDisabled}
        disabled
        onPress={showLoading}
      >
        <Text style={styles.submitTextDisabled}>Đăng bán</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

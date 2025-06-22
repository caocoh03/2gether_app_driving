import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { getCurrentUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Circle, Ellipse } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

const upcomingTrips = [
  {
    date: "24/6",
    time: "08:30",
    from: "Nhà",
    to: "27 Đường Láng, Ba...",
    status: "Đã ghép nối",
  },
  {
    date: "24/6",
    time: "13:30",
    from: "27 Đường Láng, Ba...",
    to: "Nhà",
    status: "Đã ghép nối",
  },
  {
    date: "24/6",
    time: "17:30",
    from: "Nhà",
    to: "231 Thái Hà, Đống...",
    status: "Chưa ghép nối",
  },
];

// Component đám mây
const CloudComponent = ({ size = 30, style }) => (
  <Image
    source={require("../assets/ic-cloud.png")}
    style={{ width: 60, height: 30 }}
  />
);

// Component nhân vật hành khách
const PassengerCharacter = ({ size = 60 }) => (
  <Image
    source={require("../assets/ic-monkey.png")}
    style={{ width: 65, height: 100 }}
  />
);

// Component nhân vật tài xế
const DriverCharacter = ({ size = 60 }) => (
  <Image
    source={require("../assets/ic-driver.png")}
    style={{ width: 65, height: 100 }}
  />
);

const AnimatedCloud = ({ delay = 0, speed, size, top }) => {
  const translateX = useRef(new Animated.Value(-180)).current; // Bắt đầu từ ngoài khung bên trái
  const frameWidth = (screenWidth - 40) / 2 - 10; // Width của mỗi khung trừ padding

  useEffect(() => {
    const animate = () => {
      // Delay trước khi bắt đầu animation
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: frameWidth + 60, // Bay ra ngoài khung bên phải
              duration: speed,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -190, // Reset về ngoài khung bên trái
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, delay);
    };

    animate();
  }, [translateX, speed, frameWidth, delay]);
  return (
    <Animated.View
      style={[
        styles.cloudContainer,
        {
          transform: [{ translateX }],
          top: top,
        },
      ]}
    >
      <CloudComponent size={size} />
    </Animated.View>
  );
};

// Component khung hành khách
const PassengerFrame = () => {
  return (
    <View style={styles.animatedFrame}>
      {/* Mây bay */}
      <AnimatedCloud initialPosition={-40} speed={9000} size={25} top={10} />
      <AnimatedCloud initialPosition={-60} speed={10000} size={20} top={25} />
      <AnimatedCloud initialPosition={-80} speed={11000} size={22} top={40} />

      {/* Nhân vật */}
      <View style={styles.characterContainer2}>
        <PassengerCharacter size={50} />
      </View>

      {/* Tiêu đề */}
      <View style={styles.titleContainer}>
        <Text style={styles.frameTitle}>Hành khách</Text>
      </View>
    </View>
  );
};

// Component khung tài xế
const DriverFrame = () => {
  return (
    <View style={styles.animatedFrame}>
      {/* Mây bay */}
      <AnimatedCloud initialPosition={-50} speed={7500} size={24} top={12} />
      <AnimatedCloud initialPosition={-70} speed={9000} size={18} top={30} />
      <AnimatedCloud initialPosition={-90} speed={6500} size={26} top={45} />

      {/* Nhân vật */}
      <View style={styles.characterContainer}>
        <DriverCharacter size={50} />
      </View>

      {/* Tiêu đề */}
      <View style={styles.titleContainer}>
        <Text style={styles.frameTitle}>Tài xế</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.status === "success") {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Lỗi", "Không thể lấy thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Lỗi", "Đăng xuất thất bại");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Image
            source={require("../assets/img-header-main.png")}
            style={styles.imageHeaderMain}
          />
        </View>

        <View style={styles.sectionMain}>
          <PassengerFrame />
          <DriverFrame />
        </View>

        {/* Chuyến đi sắp tới */}
        <View style={styles.tripSection}>
          <Text style={styles.tripTitle}>Chuyến đi sắp tới</Text>
        </View>
        <View style={styles.tripSection}>
          <View style={styles.leftColumn}>
            <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
              <Image
                source={require("../assets/img-view-schedule-main.png")}
                style={styles.calendarImage}
              />
            </TouchableOpacity>
          </View>

          {/* Danh sách chuyến đi bên phải */}
          <View style={styles.rightColumn}>
            {upcomingTrips.map((trip, index) => (
              <View key={index} style={styles.tripCard}>
                <Text
                  style={[
                    styles.tripStatus,
                    trip.status === "Đã ghép nối"
                      ? styles.statusSuccess
                      : styles.statusPending,
                  ]}
                >
                  {trip.status}
                </Text>
                <View style={styles.tripTime}>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                  <Text style={styles.tripHour}>{trip.time}</Text>
                </View>
                <View style={styles.tripDetail}>
                  <Text
                    style={styles.tripPlace}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {trip.from}
                  </Text>
                  <Text
                    style={styles.tripPlace}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {trip.to}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.favoriteHeader}>
          <Text style={styles.tripTitle}>Điểm đến yêu thích</Text>
          <TouchableOpacity>
            <Image
              source={require("../assets/ic-add.png")}
              style={styles.favoriteAddIcon}
            />
          </TouchableOpacity>
        </View>
        {[
          {
            icon: require("../assets/icon-location.png"),
            label: "Địa điểm",
            address: "93 Hào Nam, Ô Chợ Dừa, Đống Đa, Hà Nội",
          },
          {
            icon: require("../assets/icon-school.png"),
            label: "Trường học",
            address: "168 Nguyễn Trãi, Thanh Xuân, Hà Nội",
          },
          {
            icon: require("../assets/icon-home.png"),
            label: "Nhà",
            address: "77 Lê Văn Lương, Thanh Xuân, Hà Nội",
          },
        ].map((item, idx) => (
          <View key={idx} style={styles.favoriteRow}>
            <View style={styles.favoriteLeft}>
              <Image source={item.icon} style={styles.favoriteIcon} />
              <TouchableOpacity style={styles.favoriteDropdown}>
                <Text style={styles.favoriteDropdownText} numberOfLines={1}>
                  {item.label}
                </Text>
                <Image
                  source={require("../assets/icon-dropdown.png")}
                  style={styles.favoriteDropdownIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.favoriteRight}>
              <Text
                style={styles.favoriteAddress}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.address}
              </Text>
              <TouchableOpacity>
                <Image
                  source={require("../assets/icon-edit.png")}
                  style={styles.favoriteEditIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  welcomeSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: -20,
  },
  imageHeaderMain: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  sectionMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 20,
  },

  // Styles cho khung animation mới
  animatedFrame: {
    flex: 1,
    height: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#A0E3F2",
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  cloudContainer: {
    position: "absolute",
    zIndex: 1,
  },
  characterContainer: {
    position: "absolute",
    top: 30,
    right: 15,
    zIndex: 10,
  },
  characterContainer2: {
    position: "absolute",
    top: 30,
    right: 0,
    zIndex: 10,
  },
  titleContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    zIndex: 10,
  },
  frameTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },

  // --- Chuyến đi sắp tới ---
  tripSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 4,
  },
  favoriteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  favoriteAddIcon: {
    width: 22,
    height: 22,
  },
  favoriteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 8,
   
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  favoriteLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 3,
  },
  favoriteIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginRight: 6,
  },
  favoriteDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 90,
    minWidth: 90,
    flex: 1,
  },
  favoriteDropdownText: {
    fontWeight: "600",
    color: "#222",
    fontSize: 13,
    textAlign: "center",
    flex: 1,
  },
  favoriteDropdownIcon: {
    width: 10,
    height: 10,
    resizeMode: "contain",
  },
  favoriteRight: {
    flex: 6,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  favoriteAddress: {
    fontSize: 14,
    color: "#222",
    flex: 1,
    marginRight: 6,
    overflow: "hidden",
    numberOfLines: 1,
    ellipsizeMode: "tail",
  },
  favoriteEditIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginTop: 2,
  },
  leftColumn: {
    flex: 6,
    // alignItems: "center",
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8,
  },
  calendarImage: {
    width: "100%",
    resizeMode: "contain",
  },
  linkText: {
    fontSize: 13,
    color: "#4285F4",
    textDecorationLine: "underline",
    marginTop: 4,
  },
  rightColumn: {
    flex: 5,
    gap: 4,
  },
  tripCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8E6F3",
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripTime: {
    flex: 3,
    alignItems: "center",
  },
  tripDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
  },
  tripHour: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 4,
  },
  tripDetail: {
    flex: 7,
    paddingLeft: 12,
  },
  tripPlace: {
    fontSize: 12,
    color: "#2C3E50",
  },
  tripStatus: {
    marginTop: 4,
    fontSize: 10,
    position: "absolute",
    right: 10,
    top: 0,
    fontWeight: "600",
  },
  statusSuccess: {
    color: "#2ECC71",
  },
  statusPending: {
    color: "#E74C3C",
  },
});

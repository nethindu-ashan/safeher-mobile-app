import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useEffect,
  useState,
} from "react";

import {
  cancelSOS,
} from "../../src/services/sosService";

import {
  getPrimaryTrustedContact,
} from "../../src/services/trustedContactService";

import type {
  TrustedContact,
} from "../../src/services/trustedContactService";

import {
  useAuth,
} from "../../src/context/AuthContext";

import {
  COLORS,
} from "../../src/constants/theme";

export default function SOSActiveScreen() {
  const {
    id,
    latitude,
    longitude,
  } = useLocalSearchParams();

  const {
    isAuthenticated,
  } = useAuth();

  const [cancelling, setCancelling] =
    useState(false);

  const [contactLoading, setContactLoading] =
    useState(false);

  const [primaryContact, setPrimaryContact] =
    useState<TrustedContact | null>(null);

  const sosId =
    Array.isArray(id)
      ? id[0]
      : id;

  const latitudeValue =
    Array.isArray(latitude)
      ? latitude[0]
      : latitude;

  const longitudeValue =
    Array.isArray(longitude)
      ? longitude[0]
      : longitude;

  useEffect(() => {
    if (!isAuthenticated) {
      setPrimaryContact(null);
      return;
    }

    const loadPrimaryContact = async () => {
      try {
        setContactLoading(true);

        const contact =
          await getPrimaryTrustedContact();

        setPrimaryContact(contact);
      } catch (error) {
        console.log(
          "Unable to load primary trusted contact:",
          error
        );

        setPrimaryContact(null);
      } finally {
        setContactLoading(false);
      }
    };

    loadPrimaryContact();
  }, [isAuthenticated]);

  const locationLink =
    latitudeValue && longitudeValue
      ? `https://maps.google.com/?q=${latitudeValue},${longitudeValue}`
      : "";

  const emergencyMessage =
    locationLink
      ? `Emergency! I may need help. Please contact me immediately. My current location: ${locationLink}`
      : "Emergency! I may need help. Please contact me immediately.";

  const handleCall = async () => {
    if (!primaryContact) {
      return;
    }

    try {
      await Linking.openURL(
        `tel:${primaryContact.phone}`
      );
    } catch {
      Alert.alert(
        "Unable to Call",
        "Your phone could not open the call application."
      );
    }
  };

  const handleSMS = async () => {
    if (!primaryContact) {
      return;
    }

    try {
      const separator =
        Platform.OS === "ios"
          ? "&"
          : "?";

      const url =
        `sms:${primaryContact.phone}${separator}body=${encodeURIComponent(
          emergencyMessage
        )}`;

      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Unable to Open SMS",
        "Your phone could not open the messaging application."
      );
    }
  };

  const handleWhatsApp = async () => {
    if (!primaryContact) {
      return;
    }

    try {
      let phone =
        primaryContact.phone.replace(
          /\D/g,
          ""
        );

      if (
        phone.startsWith("0") &&
        phone.length === 10
      ) {
        phone =
          `94${phone.substring(1)}`;
      }

      const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(
          emergencyMessage
        )}`;

      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Unable to Open WhatsApp",
        "WhatsApp could not be opened on this device."
      );
    }
  };

  const handleManageContacts = () => {
    router.push(
      "/trusted-contacts"
    );
  };

  const handleSignIn = () => {
    router.push(
      "/auth/sign-in"
    );
  };

  const handleCancelSOS = () => {
    Alert.alert(
      "Cancel Emergency SOS?",
      "Are you sure you want to cancel the active SOS alert?",
      [
        {
          text: "Keep Active",
          style: "cancel",
        },
        {
          text: "Cancel SOS",
          style: "destructive",
          onPress: confirmCancelSOS,
        },
      ]
    );
  };

  const confirmCancelSOS = async () => {
    if (!sosId) {
      Alert.alert(
        "Error",
        "SOS ID is missing."
      );

      return;
    }

    try {
      setCancelling(true);

      await cancelSOS(sosId);

      router.replace({
        pathname: "/report/sos-cancelled",
        params: {
          id: sosId,
        },
      });
    } catch (error) {
      console.error(
        "SOS cancellation error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to cancel SOS.";

      Alert.alert(
        "Cancellation Failed",
        message
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 30,
          paddingBottom: 30,
        }}
      >
        <View className="items-center">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-sos-light">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-sos">
              <Ionicons
                name="alert"
                size={38}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text className="mt-7 text-2xl font-bold text-sos">
            SOS Active
          </Text>

          <Text className="mt-3 px-4 text-center leading-5 text-app-muted">
            Your emergency SOS has been recorded with
            your current location.
          </Text>
        </View>

        <View className="mt-8 w-full rounded-2xl border border-app-border bg-white p-5">
          <Text className="text-xs font-medium uppercase text-app-muted">
            Status
          </Text>

          <Text className="mt-1 font-bold text-sos">
            ACTIVE
          </Text>

          {sosId && (
            <>
              <Text className="mt-5 text-xs font-medium uppercase text-app-muted">
                SOS ID
              </Text>

              <Text className="mt-1 text-sm text-app-text">
                {sosId}
              </Text>
            </>
          )}

          {latitudeValue &&
            longitudeValue && (
              <>
                <Text className="mt-5 text-xs font-medium uppercase text-app-muted">
                  Current Location
                </Text>

                <Text className="mt-1 text-sm text-app-text">
                  {latitudeValue},{" "}
                  {longitudeValue}
                </Text>
              </>
            )}
        </View>

        <View className="mt-5">
          <Text className="text-lg font-bold text-app-text">
            Trusted Contact
          </Text>

          <Text className="mt-1 text-sm text-app-muted">
            Contact someone you trust for emergency assistance.
          </Text>

          {contactLoading ? (
            <View className="mt-4 items-center rounded-2xl border border-app-border bg-white p-6">
              <ActivityIndicator
                color={COLORS.primary}
              />

              <Text className="mt-3 text-sm text-app-muted">
                Loading primary contact...
              </Text>
            </View>
          ) : !isAuthenticated ? (
            <View className="mt-4 rounded-2xl border border-app-border bg-white p-5">
              <View className="flex-row items-start">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-light-purple">
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="font-bold text-app-text">
                    No saved contact available
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-app-muted">
                    Sign in to use your saved trusted contacts.
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleSignIn}
                className="mt-4 items-center rounded-2xl bg-primary py-3.5 active:opacity-80"
              >
                <Text className="font-bold text-white">
                  Sign In
                </Text>
              </Pressable>
            </View>
          ) : primaryContact ? (
            <View className="mt-4 rounded-2xl border border-app-border bg-white p-5">
              <View className="flex-row items-center">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-light-purple">
                  <Ionicons
                    name="person"
                    size={23}
                    color={COLORS.primary}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <View className="flex-row flex-wrap items-center">
                    <Text className="text-lg font-bold text-app-text">
                      {primaryContact.name}
                    </Text>

                    <View className="ml-2 rounded-full bg-light-purple px-3 py-1">
                      <Text className="text-xs font-bold text-primary">
                        PRIMARY
                      </Text>
                    </View>
                  </View>

                  {primaryContact.relationship && (
                    <Text className="mt-1 text-sm text-app-muted">
                      {primaryContact.relationship}
                    </Text>
                  )}

                  <Text className="mt-1 text-sm font-semibold text-app-text">
                    {primaryContact.phone}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleCall}
                className="mt-5 flex-row items-center justify-center rounded-2xl bg-primary py-4 active:opacity-80"
              >
                <Ionicons
                  name="call"
                  size={20}
                  color="#FFFFFF"
                />

                <Text className="ml-2 font-bold text-white">
                  Call
                </Text>
              </Pressable>

              <View className="mt-3 flex-row">
                <Pressable
                  onPress={handleSMS}
                  className="mr-2 flex-1 flex-row items-center justify-center rounded-2xl border border-primary py-4 active:opacity-70"
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={19}
                    color={COLORS.primary}
                  />

                  <Text className="ml-2 font-bold text-primary">
                    SMS
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleWhatsApp}
                  className="ml-2 flex-1 flex-row items-center justify-center rounded-2xl border border-primary py-4 active:opacity-70"
                >
                  <Ionicons
                    name="logo-whatsapp"
                    size={20}
                    color={COLORS.primary}
                  />

                  <Text className="ml-2 font-bold text-primary">
                    WhatsApp
                  </Text>
                </Pressable>
              </View>

              {locationLink && (
                <View className="mt-4 flex-row items-start rounded-2xl bg-light-purple p-4">
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={COLORS.primary}
                  />

                  <Text className="ml-2 flex-1 text-xs leading-5 text-app-muted">
                    SMS and WhatsApp include your current location link.
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="mt-4 rounded-2xl border border-app-border bg-white p-5">
              <View className="flex-row items-start">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-light-purple">
                  <Ionicons
                    name="people-outline"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="font-bold text-app-text">
                    No primary contact
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-app-muted">
                    Add a trusted contact or select one as your primary emergency contact.
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleManageContacts}
                className="mt-4 items-center rounded-2xl bg-primary py-3.5 active:opacity-80"
              >
                <Text className="font-bold text-white">
                  Manage Trusted Contacts
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <Pressable
          onPress={handleCancelSOS}
          disabled={cancelling}
          className={`mt-7 items-center rounded-full border border-sos py-4 ${
            cancelling
              ? "opacity-50"
              : "active:opacity-70"
          }`}
        >
          <Text className="font-bold text-sos">
            {cancelling
              ? "Cancelling..."
              : "Cancel SOS"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
} from "expo-router";
import {
  useCallback,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import {
  addTrustedContact,
  deleteTrustedContact,
  getTrustedContacts,
  setPrimaryTrustedContact,
  updateTrustedContact,
} from "../../src/services/trustedContactService";
import type {
  TrustedContact,
} from "../../src/services/trustedContactService";

export default function TrustedContactsScreen() {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [contacts, setContacts] =
    useState<TrustedContact[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingContact, setEditingContact] =
    useState<TrustedContact | null>(null);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [relationship, setRelationship] =
    useState("");

  const [isPrimary, setIsPrimary] =
    useState(false);

  const loadContacts = useCallback(
    async () => {
      if (!isAuthenticated) {
        setContacts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response =
          await getTrustedContacts();

        setContacts(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load trusted contacts.";

        Alert.alert(
          "Unable to load contacts",
          message
        );
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  useFocusEffect(
    useCallback(() => {
      if (!authLoading) {
        loadContacts();
      }
    }, [authLoading, loadContacts])
  );

  const resetForm = () => {
    setEditingContact(null);
    setName("");
    setPhone("");
    setRelationship("");
    setIsPrimary(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (
    contact: TrustedContact
  ) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(
      contact.relationship ?? ""
    );
    setIsPrimary(
      contact.isPrimary
    );
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(
        "Name required",
        "Please enter the trusted contact name."
      );
      return;
    }

    if (!phone.trim()) {
      Alert.alert(
        "Phone required",
        "Please enter the trusted contact phone number."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        relationship:
          relationship.trim(),
        isPrimary,
      };

      if (editingContact) {
        await updateTrustedContact(
          editingContact.id,
          payload
        );
      } else {
        await addTrustedContact(
          payload
        );
      }

      closeModal();

      await loadContacts();

      Alert.alert(
        "Success",
        editingContact
          ? "Trusted contact updated successfully."
          : "Trusted contact added successfully."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save trusted contact.";

      Alert.alert(
        "Unable to save",
        message
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMakePrimary = (
    contact: TrustedContact
  ) => {
    Alert.alert(
      "Set Primary Contact",
      `Set ${contact.name} as your primary trusted contact?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Set Primary",
          onPress: async () => {
            try {
              await setPrimaryTrustedContact(
                contact.id
              );

              await loadContacts();
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Unable to update primary contact.";

              Alert.alert(
                "Unable to update",
                message
              );
            }
          },
        },
      ]
    );
  };

  const handleDelete = (
    contact: TrustedContact
  ) => {
    Alert.alert(
      "Delete Trusted Contact",
      `Are you sure you want to remove ${contact.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTrustedContact(
                contact.id
              );

              await loadContacts();
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Unable to delete trusted contact.";

              Alert.alert(
                "Delete failed",
                message
              );
            }
          },
        },
      ]
    );
  };

  if (authLoading || loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text className="mt-3 text-sm text-app-muted">
            Loading trusted contacts...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 px-5">
          <View className="mt-4 flex-row items-center">
            <Pressable
              onPress={() =>
                router.back()
              }
              className="h-11 w-11 items-center justify-center rounded-full bg-white"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.text}
              />
            </Pressable>

            <Text className="ml-3 text-2xl font-bold text-app-text">
              Trusted Contacts
            </Text>
          </View>

          <View className="flex-1 items-center justify-center px-6">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-light-purple">
              <Ionicons
                name="people-outline"
                size={38}
                color={COLORS.primary}
              />
            </View>

            <Text className="mt-5 text-xl font-bold text-app-text">
              Sign in required
            </Text>

            <Text className="mt-2 text-center text-sm leading-6 text-app-muted">
              Sign in to securely save and manage your trusted emergency contacts.
            </Text>

            <Pressable
              onPress={() =>
                router.push(
                  "/auth/sign-in"
                )
              }
              className="mt-6 w-full items-center rounded-2xl bg-primary py-4 active:opacity-80"
            >
              <Text className="text-base font-bold text-white">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        <View className="mt-4 flex-row items-center">
          <Pressable
            onPress={() =>
              router.back()
            }
            className="h-11 w-11 items-center justify-center rounded-full border border-app-border bg-white active:opacity-70"
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={COLORS.text}
            />
          </Pressable>

          <View className="ml-3 flex-1">
            <Text className="text-2xl font-bold text-app-text">
              Trusted Contacts
            </Text>

            <Text className="mt-1 text-xs text-app-muted">
              Emergency contacts you trust
            </Text>
          </View>
        </View>

        <View className="mt-6 rounded-3xl bg-light-purple p-5">
          <View className="flex-row">
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={COLORS.primary}
            />

            <View className="ml-3 flex-1">
              <Text className="font-bold text-app-text">
                Emergency support
              </Text>

              <Text className="mt-1 text-sm leading-5 text-app-muted">
                Your primary contact will be shown first when SafeHer SOS is activated.
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={openAddModal}
          className="mt-5 flex-row items-center justify-center rounded-2xl bg-primary py-4 active:opacity-80"
        >
          <Ionicons
            name="person-add-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text className="ml-2 text-base font-bold text-white">
            Add Trusted Contact
          </Text>
        </Pressable>

        {contacts.length === 0 ? (
          <View className="mt-14 items-center px-5">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white">
              <Ionicons
                name="people-outline"
                size={38}
                color={
                  COLORS.textSecondary
                }
              />
            </View>

            <Text className="mt-5 text-lg font-bold text-app-text">
              No trusted contacts yet
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-app-muted">
              Add a family member, friend or another person you trust during an emergency.
            </Text>
          </View>
        ) : (
          <View className="mt-6">
            {contacts.map(
              (contact) => (
                <View
                  key={contact.id}
                  className="mb-4 rounded-3xl border border-app-border bg-white p-5"
                >
                  <View className="flex-row items-start">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-light-purple">
                      <Ionicons
                        name="person-outline"
                        size={24}
                        color={
                          COLORS.primary
                        }
                      />
                    </View>

                    <View className="ml-3 flex-1">
                      <View className="flex-row flex-wrap items-center">
                        <Text className="text-lg font-bold text-app-text">
                          {contact.name}
                        </Text>

                        {contact.isPrimary && (
                          <View className="ml-2 rounded-full bg-light-purple px-3 py-1">
                            <Text className="text-xs font-bold text-primary">
                              PRIMARY
                            </Text>
                          </View>
                        )}
                      </View>

                      {contact.relationship && (
                        <Text className="mt-1 text-sm text-app-muted">
                          {contact.relationship}
                        </Text>
                      )}

                      <View className="mt-3 flex-row items-center">
                        <Ionicons
                          name="call-outline"
                          size={17}
                          color={
                            COLORS.textSecondary
                          }
                        />

                        <Text className="ml-2 text-sm font-semibold text-app-text">
                          {contact.phone}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {!contact.isPrimary && (
                    <Pressable
                      onPress={() =>
                        handleMakePrimary(
                          contact
                        )
                      }
                      className="mt-4 flex-row items-center justify-center rounded-2xl bg-light-purple py-3 active:opacity-70"
                    >
                      <Ionicons
                        name="star-outline"
                        size={18}
                        color={
                          COLORS.primary
                        }
                      />

                      <Text className="ml-2 font-bold text-primary">
                        Make Primary
                      </Text>
                    </Pressable>
                  )}

                  <View className="mt-3 flex-row">
                    <Pressable
                      onPress={() =>
                        openEditModal(
                          contact
                        )
                      }
                      className="mr-2 flex-1 flex-row items-center justify-center rounded-2xl border border-app-border py-3 active:opacity-70"
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color={
                          COLORS.primary
                        }
                      />

                      <Text className="ml-2 font-semibold text-app-text">
                        Edit
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        handleDelete(
                          contact
                        )
                      }
                      className="ml-2 flex-1 flex-row items-center justify-center rounded-2xl border border-red-200 py-3 active:opacity-70"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={
                          COLORS.error
                        }
                      />

                      <Text
                        className="ml-2 font-semibold"
                        style={{
                          color:
                            COLORS.error,
                        }}
                      >
                        Delete
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={
          closeModal
        }
      >
        <KeyboardAvoidingView
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
          className="flex-1 justify-end bg-black/40"
        >
          <View className="rounded-t-[32px] bg-white px-5 pb-10 pt-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-bold text-app-text">
                  {editingContact
                    ? "Edit Contact"
                    : "Add Trusted Contact"}
                </Text>

                <Text className="mt-1 text-sm text-app-muted">
                  Emergency contact information
                </Text>
              </View>

              <Pressable
                onPress={
                  closeModal
                }
                className="h-10 w-10 items-center justify-center rounded-full bg-light-purple"
              >
                <Ionicons
                  name="close"
                  size={23}
                  color={
                    COLORS.primary
                  }
                />
              </Pressable>
            </View>

            <Text className="mt-6 text-sm font-semibold text-app-text">
              Contact Name
            </Text>

            <TextInput
              value={name}
              onChangeText={
                setName
              }
              placeholder="Example: Mother"
              placeholderTextColor="#A995B5"
              className="mt-2 rounded-2xl border border-app-border bg-white px-4 py-4 text-app-text"
            />

            <Text className="mt-4 text-sm font-semibold text-app-text">
              Phone Number
            </Text>

            <TextInput
              value={phone}
              onChangeText={
                setPhone
              }
              keyboardType="phone-pad"
              placeholder="+94771234567"
              placeholderTextColor="#A995B5"
              className="mt-2 rounded-2xl border border-app-border bg-white px-4 py-4 text-app-text"
            />

            <Text className="mt-4 text-sm font-semibold text-app-text">
              Relationship
            </Text>

            <TextInput
              value={relationship}
              onChangeText={
                setRelationship
              }
              placeholder="Mother, Father, Friend..."
              placeholderTextColor="#A995B5"
              className="mt-2 rounded-2xl border border-app-border bg-white px-4 py-4 text-app-text"
            />

            <View className="mt-5 flex-row items-center rounded-2xl bg-light-purple p-4">
              <View className="flex-1 pr-4">
                <Text className="font-bold text-app-text">
                  Primary Contact
                </Text>

                <Text className="mt-1 text-xs leading-5 text-app-muted">
                  SafeHer will prioritize this person during SOS.
                </Text>
              </View>

              <Switch
                value={isPrimary}
                onValueChange={
                  setIsPrimary
                }
                trackColor={{
                  false:
                    "#D1D5DB",
                  true:
                    COLORS.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Pressable
              disabled={saving}
              onPress={handleSave}
              className={`mt-6 items-center rounded-2xl bg-primary py-4 ${
                saving
                  ? "opacity-60"
                  : "active:opacity-80"
              }`}
            >
              {saving ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text className="text-base font-bold text-white">
                  {editingContact
                    ? "Save Changes"
                    : "Save Contact"}
                </Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
import {
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Props = TextInputProps & {
  label?: string;
};

export default function AppInput({
  label,
  ...props
}: Props) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-2 text-sm font-medium text-app-text">
          {label}
        </Text>
      )}

      <TextInput
        className="rounded-xl border border-app-border bg-white px-4 py-3 text-app-text"
        placeholderTextColor="#8A8192"
        {...props}
      />
    </View>
  );
}
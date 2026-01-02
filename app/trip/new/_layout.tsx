import { Stack } from 'expo-router';

export default function NewTripLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}

import StackNavigator from "../navigation/StackNavigator";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Provider } from'react-redux';
import store from "../redux/store";
import { ModalPortal } from "react-native-modals";
import { UserContext } from "../UserContext";
import { Stack } from "expo-router";

export default function Index() {
  return (
    <>
    <Stack.Screen options={{headerShown: false}} />
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <UserContext>
          <StackNavigator />
          <ModalPortal />
        </UserContext>
      </Provider>
        
    </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
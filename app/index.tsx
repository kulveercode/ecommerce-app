import StackNavigator from "../navigation/StackNavigator";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Provider } from'react-redux';
import store from "../redux/store";
import { ModalPortal } from "react-native-modals";

export default function Index() {
  return (
    <>
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <StackNavigator />
        <ModalPortal />
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
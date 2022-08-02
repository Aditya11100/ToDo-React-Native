import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState<Array<string>>([]);
  const [isEdit, setIsEdit] = useState<any>(null);

  const getStorage = async () => {
    const jsonValue = await AsyncStorage.getItem("data");
    if (jsonValue) {
      const parseValue = JSON.parse(jsonValue);
      setData(parseValue);
    }
  };

  useEffect(() => {
    getStorage();
  }, []);

  const setStorage = async () => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem("data", jsonValue);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    setStorage();
  }, [data]);

  const addData = () => {
    if (text) {
      if (isEdit !== null) {
        const arr = data.map((item: string, index: number) =>
          index === isEdit ? text : item
        );
        setData(arr);
        setText("");
        setIsEdit(null);
        return;
      }
      setData([text, ...data]);
      setText("");
    }
  };

  const editItem = (index: number, item: string) => {
    setIsEdit(index);
    setText(item);
  };

  const deleteItem = (index: number) => {
    if (isEdit === index) {
      cancleUpdate();
    }
    const new_arr = data.filter((_: string, i: number) => i !== index);
    setData(new_arr);
  };

  const cancleUpdate = () => {
    setIsEdit(null);
    setText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={text}
        onChangeText={(value) => setText(value)}
        style={styles.input}
        placeholder={"Item Name"}
      />
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#34dbeb",
            paddingVertical: 4,
            paddingHorizontal: 12,
            marginTop: 5,
            borderRadius: 10,
          }}
          onPress={addData}
        >
          <Text>{isEdit !== null ? "Update" : "Add"}</Text>
        </TouchableOpacity>
        {isEdit !== null && (
          <TouchableOpacity
            style={{
              backgroundColor: "#eb3734",
              paddingVertical: 4,
              paddingHorizontal: 12,
              marginTop: 5,
              borderRadius: 10,
            }}
            onPress={cancleUpdate}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        style={{ marginTop: 10 }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {data?.map((item: string, index: number) => (
          <View
            key={item + index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 5,
              borderBottomColor: "#b8b4b4",
              paddingBottom: 6,
              borderBottomWidth: 0.6,
            }}
          >
            <Text style={{ flexShrink: 1 }}>{item}</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 12 }}
                onPress={() => editItem(index, item)}
              >
                <Text>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem(index)}>
                <Text>Delete</Text>
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
    backgroundColor: "#fff",
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    paddingVertical: 5,
    marginTop: 60,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});

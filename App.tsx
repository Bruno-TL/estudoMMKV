import { Text, View, TextInput, Button } from "react-native";
import { styles } from "./styles";
import { MMKV, useMMKVString, useMMKVObject, useMMKV } from "react-native-mmkv";
import { useEffect, useState } from "react";

// const storage = new MMKV({ id: "myapp" });

type User = {
  name: string;
  email: string;
};

export default function App() {
  const [name, setName] = useState("user.name");
  const [email, setEmail] = useState("user.email");
  const [user, setUser] = useMMKVObject<User>("user");

  const storage = useMMKV({ id: "myapp" });

  function handleSave() {
    // storage.set("user", JSON.stringify({ name, email }));
    setUser({ name, email });
  }

  function fetchUser() {
    const data = storage.getString("user");
    setUser(data ? JSON.parse(data) : {});
  }

  useEffect(() => {
    const listener = storage.addOnValueChangedListener((changedKey) => {
      fetchUser();
    });

    return () => listener.remove();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome..."
        style={styles.input}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email..."
        style={styles.input}
        onChangeText={setEmail}
      />
      <Button title="Salvar" onPress={handleSave} />

      <Text style={styles.text}>
        {user?.name} - {user?.email}
      </Text>
    </View>
  );
}

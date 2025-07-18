import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome5';

const HeaderRightButton = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  return (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity onPress={() => navigation.navigate("Orientações de Uso")} activeOpacity={0.1}>
        <Icon size={24} style={{ color: '#FFF' }} name={'question-circle'} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRightButton;
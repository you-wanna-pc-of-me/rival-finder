import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FC, useState, useEffect } from "react";
import {
  Text,
  View,
} from "react-native";
import db, { auth } from "../../config/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { RootStackParamList } from "../navigation";
import {
  ProfileImageContainer,
  ProfileImage,
  MenuText,
  ProfileMenu,
  ProfileMenuText,
  COLORS,
} from "../components/Stylesheet";
import { Interests, Rivals, Settings } from "../components/ProfileTabs";

type profileStack = NativeStackNavigationProp<
  RootStackParamList,
  "UserProfile"
>;

interface SingleUserProps {
  person: {
    username: string;
    profileUrl: string;
    bio: string;
    interests: {
      art: boolean,
      cooking: boolean,
      gaming: boolean,
      math: boolean,
      sports: boolean
    };
    age: number;
    email: string;
    rivals: string[];
  };
}

  /**
   * @param getRivals - will fetch every rivals information and sets the rivals state to them in an array/object type.
   * @param getUserInfo - Will fetch for the users data and will set the person in the state with the information return.
   * */

const userSnap: any = {};

const UserProfileScreen: FC<SingleUserProps> = () => {
  const [person, setPerson] = useState({});
  const [currentView, setCurrentView] = useState("Rivals");
  const [rivals, setRivals] = useState<Array<object>>([]);
  const [user, setUser] = useState({});
 
 useEffect(() => {
    async function getUserInfo() {
      const currentUser = auth.currentUser;
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
      // console.log("User Information", docSnap.data());
      
      const userInfo = docSnap.data();
      setPerson(userInfo);
      setUser({
        username: userInfo.username,
        profileUrl: userInfo.profileUrl
      });

      // console.log("Users Rivals ", userInfo.rivals);
      const rivalsArrayy = [];
      const resultFor = userInfo.rivals.forEach( async (rival) => {
         const rivalRef = doc(db, "users", rival);
        const docSnap = await getDoc(rivalRef);
        
        const rivalsInfo = docSnap.data();
        rivalsInfo["uid"] = rival;
        rivalsArrayy.push(rivalsInfo);
        setRivals([...rivalsArrayy])
        // console.log("Every Rivals=>>", rivalsArrayy);
      })
      // console.log("Result =>>", rivalsArrayy);
      return rivalsArrayy;
    };
    const result = getUserInfo()
  },[])

  useEffect(() => {
    const currentUser = auth.currentUser;
    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (rivalry) => {
      const rivalsArrayy = [];
      rivalry.data().rivals.forEach( async (rival) => {
        const rivalRef = doc(db, "users", rival);
       const docSnap = await getDoc(rivalRef);
       const rivalsInfo = docSnap.data();
       rivalsInfo["uid"] = rival;
       rivalsArrayy.push(rivalsInfo);
       setRivals([...rivalsArrayy])
       // console.log("Every Rivals=>>", rivalsArrayy);
     })
    });
    return () => unsubscribe();
  }, [])
 
  const navigation = useNavigation<profileStack>();

  return (
    
    <View>
      <ProfileImageContainer>
        <ProfileImage source={{ uri: person.profileUrl }} />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          {person.username}
        </Text>
      </ProfileImageContainer>
      <ProfileMenu>

        <ProfileMenuText onPress={() => setCurrentView("Interests")}>
          <MenuText>INTERESTS</MenuText>
        </ProfileMenuText>
        <ProfileMenuText onPress={() => setCurrentView("Rivals")}>
          <MenuText>RIVALS</MenuText>
          <View style={{width: 30, position: "absolute", right: 5, marginTop:-10, borderColor: COLORS.purple, borderStyle: "solid", borderWidth: 1 , backgroundColor: "white", borderRadius: 10}} >
            <Text style={{color: COLORS.purple, textAlign: "center" }}>{rivals.length}</Text>
          </View>
        </ProfileMenuText>
        <ProfileMenuText onPress={() => setCurrentView("Settings")}>
          <MenuText>SETTINGS</MenuText>
        </ProfileMenuText>
      </ProfileMenu>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 15,
          textAlign: "center",
          marginTop: -2,
          paddingVertical: 10,
          marginHorizontal: -5,
          paddingHorizontal: 10,
          borderStyle: "solid",
          borderWidth: 3,
          borderBottomColor: "#2D142C",
        }}
      >
        {person.bio}
      </Text>
      {currentView === "Rivals" ? (
        <Rivals rivals={rivals}/>
      ) : currentView === "Interests" ? (<Interests person={person}/>) : (<Settings person={person}/>)}
    </View>
  );
};

export default UserProfileScreen;

 // async function getUserInfo(user) {
  //   const userRef = doc(db, "users", user.uid);
  //   const docSnap = await getDoc(userRef);
  //   return docSnap;
  // }

  // async function getRivals() {
  //   const arr = []
  //   rivalsID.forEach(async(rival) => {
  //     const userRiv = doc(db, "users", rival)
  //     const userRivDoc = await getDoc(userRiv);
  //     arr.push(userRivDoc.data())
  //   })
  //   setRivals(arr)
  // }

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       userSnap["user"] = await getUserInfo(user);
  //       setPerson(userSnap.user.data());
  //       setRivalsLength(userSnap.user.data().rivals.length)
  //       setRivalsID(userSnap.user.data().rivals)
  //     }
  //   });
  //   return unsubscribe;
  // }, []);

  // useEffect(() => { // UseEffect will only work if the rivalsId array is not empty && the rivals array is empty.
  //   // setRivalsID(userProps.rivals)
  //   if(rivalsID && !rivals.length) getRivals()
  // }, [rivalsID]);
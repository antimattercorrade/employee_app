import React, {useState} from 'react';
import { StyleSheet, Text, View, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CreateEmployee = ({navigation,route}) => {

    const getDetails = (type) => {
        if(route.params) {
            switch(type){
                case "name": return route.params.name
                case "phone": return route.params.phone
                case "email": return route.params.email
                case "salary": return route.params.salary
                case "picture": return route.params.picture
                case "position": return route.params.position
            }
        } else {
            return ""
        }
    }


    const [name, setName] = useState(getDetails("name"))
    const [phone, setPhone] = useState(getDetails("phone"))
    const [email, setEmail] = useState(getDetails("email"))
    const [salary, setSalary] = useState(getDetails("salary"))
    const [picture, setPicture] = useState(getDetails("picture"))
    const [position, setPosition] = useState(getDetails("position"))
    const [modalVisible, setModal] = useState(false)
    const [enableshift, setenableshift] = useState(false)

    const submitData = () => {
        fetch("http://9ef5f2cd.ngrok.io/send-data", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                salary: salary,
                picture: picture,
                position: position
            })
        }).then(res => res.json())
        .then(data => {
            Alert.alert(`${data.name} is saved successfully`)
            navigation.navigate("Home")
        })
        .catch(err => {
            Alert.alert("Something went wrong while saving details")
        })
        
    }

    const updateDetails = () => {
        fetch("http://9ef5f2cd.ngrok.io/update", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: route.params._id,
                name: name,
                email: email,
                phone: phone,
                salary: salary,
                picture: picture,
                position: position
            })
        }).then(res => res.json())
        .then(data => {
            Alert.alert(`${data.name} is updated successfully`)
            navigation.navigate("Home")
        })
        .catch(err => {
            Alert.alert("Something went wrong while updating details")
        })
        
    }

    const pickFromGallery = async() => {
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (granted) {
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1,1],
                quality: 0.5
            })
            if(!data.cancelled){
                let newFile = {
                    uri: data.uri,
                    type: `test/${data.uri.split('.')[1]}`,
                    name: `test.${data.uri.split('.')[1]}`
                }
                handleUpload(newFile)
            }
        } else {
            Alert.alert("You need to give us permission to work")
        }
    }

    const pickFromCamera = async() => {
        const {granted} = await Permissions.askAsync(Permissions.CAMERA)
        if (granted) {
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1,1],
                quality: 0.5
            })
            if(!data.cancelled){
                let newFile = {
                    uri: data.uri,
                    type: `test/${data.uri.split('.')[1]}`,
                    name: `test.${data.uri.split('.')[1]}`
                }
                handleUpload(newFile)
            }
        } else {
            Alert.alert("You need to give us permission to work")
        }
    }

    const handleUpload = (image) => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset',"employeeApp")
        data.append('cloud_name','reactnativenew')

        fetch('https://api.cloudinary.com/v1_1/reactnativenew/image/upload', 
        {method: "post",
        body: data  
        }).then(res => res.json())
        .then(data => {
            setPicture(data.url)
            setModal(false)
        }).catch(err => {
            Alert.alert("Error while uploading")
        })
    }
    
    return (
        <KeyboardAvoidingView behavior = "position" style = {styles.root} enabled = {enableshift}>

        
        <View >
            
            <TextInput 
                label = "Name"
                style = {styles.inputstyle}
                value = {name}
                theme = {theme}
                onFocus = {() => setenableshift(false)}
                mode = "outlined"
                onChangeText = {text => setName(text)}
            />

            <TextInput 
                label = "Email"
                style = {styles.inputstyle}
                value = {email}
                theme = {theme}
                onFocus = {() => setenableshift(false)}
                mode = "outlined"
                onChangeText = {text => setEmail(text)}
            />

            <TextInput 
                label = "Phone"
                style = {styles.inputstyle}
                value = {phone}
                theme = {theme}
                onFocus = {() => setenableshift(false)}
                keyboardType = "number-pad"
                mode = "outlined"
                onChangeText = {text => setPhone(text)}
            />

            <TextInput 
                label = "Salary"
                style = {styles.inputstyle}
                value = {salary}
                theme = {theme}
                onFocus = {() => setenableshift(true)}
                mode = "outlined"
                onChangeText = {text => setSalary(text)}
            />

            <TextInput 
                label = "Position"
                style = {styles.inputstyle}
                value = {position}
                theme = {theme}
                onFocus = {() => setenableshift(true)}
                mode = "outlined"
                onChangeText = {text => setPosition(text)}
            />

            <Button 
                style = {styles.inputstyle}
                icon = {picture == "" ? "upload" : "check"}
                mode = "contained"
                theme = {theme}
                onPress = {() => setModal(true)}
                >
                Upload Image
            </Button>
            {route.params ? 
                <Button 
                style = {styles.inputstyle}
                icon = "content-save"
                mode = "contained"
                theme = {theme}
                onPress = {() => updateDetails()}>
                Update Details
            </Button>

                :
                <Button 
                style = {styles.inputstyle}
                icon = "content-save"
                mode = "contained"
                theme = {theme}
                onPress = {() => submitData()}>
                Save
            </Button>
            }
            

            <Modal
                animationType = "slide"
                transparent = {true}
                visible = {modalVisible}
                onRequestClose = {() => {setModal(false)}}
                >
                    <View style = {styles.modalView}>
                        <View style = {styles.modalButtonView}>
                            <Button 
                                icon = "camera"
                                mode = "contained"
                                theme = {theme}
                                onPress = {() => pickFromCamera()}>
                                Camera
                            </Button>
                            
                            <Button 
                                icon = "image-area"
                                mode = "contained"
                                theme = {theme}
                                onPress = {() => pickFromGallery()}>
                                Gallery
                            </Button>
                        </View>
                        <Button 
                            theme = {theme}
                            onPress = {() => setModal(false)}>
                            Cancel
                        </Button>
                    </View>
            </Modal>
                
        </View>
        </KeyboardAvoidingView>
    )
}

const theme = {
    colors: {
        primary: "#006aff"
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    inputstyle: {
        margin: 5
    },
    modalView: {
        position: "absolute",
        bottom: 2,
        width: "100%",
        backgroundColor: "white"
    },
    modalButtonView: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
})

export default CreateEmployee;
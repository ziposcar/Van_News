import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    PixelRatio,
    ToastAndroid,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';
import {
    Button,
} from 'react-native-elements';
import CheckBox from 'react-native-check-box';
let checked = [true, true, true,];
export default class DrawerLayoutMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // the state of checkBoxes
            checked: [true, true, true,],
        }
    }
    //sent the theme params
    clickColor = (index) => {
        DeviceEventEmitter.emit('ChangeColor', index);
    }
    clickPage = (index) => {
        // checked or not checked
        checked[index] = !checked[index];
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerT}>
                    <View
                        activeOpacity={0.6}
                        style={[styles.menuItemContainer, this.props.style.ItemBackGroundColor]}
                    >
                        <Text style={[styles.menuItem, this.props.style.textSwiper]}>主题颜色</Text>
                    </View>
                    {/*add buttons for each theme*/}
                    <View style={[styles.menuItemContainerT, this.props.style.backgroundColor]}>
                        <Button
                            title='white'
                            color='#000'
                            backgroundColor='#fff'
                            buttonStyle={styles.buttonStyle}
                            onPress={() => this.clickColor(0)}
                        />
                        <Button
                            title='dark'
                            color='#fff'
                            backgroundColor='#000'
                            buttonStyle={styles.buttonStyle}
                            onPress={() => this.clickColor(1)}
                        />
                    </View>
                </View>
                <View style={styles.containerC}>
                    <View
                        activeOpacity={0.6}
                        style={[styles.menuItemContainer, this.props.style.ItemBackGroundColor]}
                    >
                        <Text style={[styles.menuItem, this.props.style.textSwiper]}>新闻分类</Text>
                    </View>
                    <View style={[styles.menuItemContainerC, this.props.style.backgroundColor, { flexDirection: 'column' }]}>
                        {/* checkBoxes for different news sources */}
                        <CheckBox
                            style={{ padding: 10, margin: 10 }}
                            onClick={() => {
                                (() => {
                                    checked[0] = !checked[0];
                                    this.setState({checked, checked});
                                    DeviceEventEmitter.emit('ChangePages', checked);
                                })();
                            }}
                            isChecked={this.state.checked[0]}
                            leftText={'新浪网'}
                        />
                        <CheckBox
                            style={{ padding: 10, margin: 10 }}
                            onClick={() => {
                                (() => {
                                    checked[1] = !checked[1];
                                    this.setState({checked, checked});
                                    DeviceEventEmitter.emit('ChangePages', checked);
                                })();
                            }}
                            isChecked={this.state.checked[1]}
                            leftText={'搜狐新闻'}
                        />
                        <CheckBox
                            style={{ padding: 10, margin: 10 }}
                            onClick={() => {
                                (() => {
                                    checked[2] = !checked[2];
                                    this.setState({checked, checked});
                                    DeviceEventEmitter.emit('ChangePages', checked);
                                })();
                            }}
                            isChecked={this.state.checked[2]}
                            leftText={'China Daily'}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    containerT: {
        height: Dimensions.get('screen').height * 0.25,
        width: Dimensions.get('screen').width * 2 / 3,
    },
    containerC: {
        height: Dimensions.get('screen').height * 0.75,
        width: Dimensions.get('screen').width * 2 / 3,
    },
    container: {
        backgroundColor: '#777777',
        flex: 1,
    },
    menuItemContainer: {
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.075,
        paddingLeft: 10,
    },
    menuItemContainerT: {
        height: Dimensions.get('screen').height * 0.175,
        flexDirection: 'row',
    },
    menuItemContainerC: {
        height: Dimensions.get('screen').height * 0.675,
        flexDirection: 'row',
    },
    menuItem: {
        fontSize: 18,
    },
    buttonStyle: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 22,
        height: 22,
        width: 22,
        marginVertical: 10,
        marginHorizontal: 1,
    },
};
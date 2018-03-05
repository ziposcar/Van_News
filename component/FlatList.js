import React, { Component } from 'react';
// import http from 'http';
import cheerio from 'cheerio-without-node-native';
import Swiper from 'react-native-swiper';
import WebViewMenu from './WebViewMenu'
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  DeviceEventEmitter,
  TabBarIOS,
} from 'react-native';

let SwiperAmount = 3;
let elementsTmp = [];
let elementsSet = [];
let swiperSet = [];//to store elements for swiper
let swiperTmp = [
  { text: "", url: "", imageSource: "", base: { url: "", title: '' }, },
  { text: "", url: "", imageSource: "", base: { url: "", title: '' }, },
  { text: "", url: "", imageSource: "", base: { url: "", title: '' }, },
];//use to initial the swiper
const urlBases = [
  { url: "http://www.sina.com.cn/", title: '新浪网' },
  { url: "http://news.sohu.com/", title: '搜狐新闻' },
  { url: "http://www.chinadaily.com.cn/", title: 'China_Daily' },
];// the news sources we uesd
export default class FlatListMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detail: false,
      current: 0,// to record which one is clicked
      elements: [],// the date binding with the Flatlist
      swiperItems: swiperTmp,// the date binding with the swiper
      text: '',
      swiperShow: false,// whether there is data in our swiper
      checked: [true, true, true],// uesd for the checkBoxes
    }
  }

  //download the home page of news sources
  download = (url, callback) => {
    fetch(url)
      .then((res) => res.text())
      .then((res) => {
        callback(res);
      })
      .catch(e => { })
      .done();
  }

  // Decide whether push an label into flatlist or not
  // and do that
  // The details is we decide after we analysed the html
  pushIntoElements = (i, e) => {
    if (callingUrlBase === 0) {
      if (e.parentNode.attribs.class !== 'first_list' && e.childNodes[0].data.length >= 8) {
        // get details in one child page
        fetch(e.attribs.href)
          .then(res => res.text())
          .then(res => {
            let $ = cheerio.load(res);
            let pics = null;
            // we only need news with image
            // selector to get all <div/> which belongs to img_wrapper class
            // and find all <img/> in them
            pics = $('div.img_wrapper').find('img');
            if (pics.length !== 0) {
              if (!elementsSet[e.attribs.href]) {
                elementsSet[e.attribs.href] = true;
                if (swiperSet.length < 3) {
                  // when there is not enough elements in swiper
                  // we push them into the swiper
                  swiperSet.push({
                    text: e.childNodes[0].data,
                    url: e.attribs.href,
                    imgSource: pics[0].attribs.src,
                    base: urlBases[0],
                  })
                }
                else {
                  // push them into the flatlist
                  elementsTmp.push({
                    text: e.childNodes[0].data,
                    url: e.attribs.href,
                    imgSource: pics[0].attribs.src,
                    base: urlBases[0],
                  })
                }
                if (swiperSet.length === 3) {
                  this.setState({ swiperItems: swiperSet });
                  this.setState({ swiperShow: true });
                }
                this.setState({ elements: elementsTmp });
              }
            }
          })
          .catch(error => { })
          .done();
      }
    }
    else if (callingUrlBase === 1) {
      if (e.attribs.title.length >= 8) {
        if (!elementsSet[e.attribs.href]) {
          elementsSet[e.attribs.href] = true;
          fetch('http:' + e.attribs.href)
            .then(res => res.text())
            .then(res => {
              let $ = cheerio.load(res);
              let pics = null;
              pics = $('table').find('img');
              if (pics.length !== 0) {
                if (swiperSet.length < 3) {
                  swiperSet.push({
                    text: e.attribs.title,
                    url: 'http:' + e.attribs.href,
                    imgSource: 'http:' + pics[0].attribs.src,
                    base: urlBases[1],
                  })
                }
                else {
                  elementsTmp.push({
                    text: e.attribs.title,
                    url: 'http:' + e.attribs.href,
                    imgSource: 'http:' + pics[0].attribs.src,
                    base: urlBases[1],
                  })
                }
                if (swiperSet.length === 3) {
                  this.setState({ swiperItems: swiperSet });
                  this.setState({ swiperShow: true });
                }
                this.setState({ elements: elementsTmp });
              }
            })
            .catch(error => { })
            .done();
        }
      }
    }
    else if (callingUrlBase === 2) {
      if (cheerio(e).find('img').length === 0) {
        if (!elementsSet[e.attribs.href]) {
          elementsSet[e.attribs.href] = true;
          fetch(e.attribs.href)
            .then(res => res.text())
            .then(res => {
              let $ = cheerio.load(res);
              let pics = null;
              pics = $('figure.image').find('img');
              if (pics.length !== 0) {
                if (swiperSet.length < 3) {
                  swiperSet.push({
                    text: e.childNodes[0].data,
                    url: e.attribs.href,
                    imgSource: pics[0].attribs.src,
                    base: urlBases[2],
                  })
                }
                else {
                  elementsTmp.push({
                    text: e.childNodes[0].data,
                    url: e.attribs.href,
                    imgSource: pics[0].attribs.src,
                    base: urlBases[2],
                  })
                }
                if (swiperSet.length === 3) {
                  this.setState({ swiperItems: swiperSet });
                  this.setState({ swiperShow: true });
                }
                this.setState({ elements: elementsTmp });
              }
            })
            .catch(error => { })
            .done();
        }
      }
    }
  }

  // Be used for get all elements
  GetElements = () => {
    // for each news sources
    urlBases.forEach((e, idx) => {
      // download one of them
      this.download(e.url, (data) => {
        if (data) {
          // Cheerio module load the html text
          let $ = cheerio.load(data);
          if (idx === 0 && this.state.checked[0]) {
            callingUrlBase = 0;
            // selector to get the <ur/>s which belongs to 'news_top' calss
            // and find all <a/> in them
            // and for each of <a/>, call this.pushIntoElements function
            $('ul.news_top').find('a').each(this.pushIntoElements);
            $('ul.news_bottom').find('a').each(this.pushIntoElements);
          }
          else if (idx === 1 && this.state.checked[1]) {
            callingUrlBase = 1;
            $('div.list16').find('a').each(this.pushIntoElements);
          }
          else if (idx === 2 && this.state.checked[2]) {
            callingUrlBase = 2;
            $('div.cmLBox').find('a').each(this.pushIntoElements);
          }
        } else {
        }
      });
    });
  }

  // Be used for refresh the UI for each item in FlatList
  componentWillReceiveProps() {
    let li = [];
    this.state.elements.forEach((e) => { li.push(e) });
    this.setState({ elements: li });
  }

  // remove all listener
  componentWillUnmount() {
    this.subscription.remove();
  }

  componentDidMount() {
    // add listener to change news sources
    this.subscription = DeviceEventEmitter.addListener('ChangePages', (data) => {
      this.setState({ checked: data });
      this.setState({ elements: [] });
      this.setState({ swiperShow: false });
      elementsSet = [];
      elementsTmp = [];
      swiperSet = [];
      this.GetElements();
    });
    this.GetElements();
  }

  // used in onPress of the flatlist items
  click = (index) => {
    this.setState({
      current: index,
      detail: true,
    });
    //switch to the webview page
    DeviceEventEmitter.emit('ToWebView', this.state.elements[index].url);
  }

  //used in onPress of the swiper elements
  clickSwiper = (index) => {
    this.setState({
      current: index,
      detail: true,
    });
    //switch to the webview page    
    DeviceEventEmitter.emit('ToWebView', swiperSet[index].url);
  }

  //flatlist items
  renderItem = ({ item, index }) => (
    <View style={[styles.renderItem, this.props.style.renderItem]}>
      {/*image and text are in a button*/}
      <TouchableOpacity
        style={{ flex: 4 }}
        onPress={() => this.click(index)}//click the button to switch towebview page
      >
        <View style={{ flexDirection: 'row' }}>
          <View
            style={[styles.viewBorder, { margin: 5, }, this.props.style.viewBorder]}
          >
            <Image
              style={styles.ImageItem}
              source={{ uri: item.imgSource }}//the head image of each piece of news 
            />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.txt, this.props.style.txt]}>
              {/* the title of each piece of news */}
              {item.text}
            </Text>
            <Text style={[styles.txtBase, this.props.style.txtBase]}>
              {/* the source of each piece of news */}
              {item.base.title + '\n' + item.base.url}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )

  //swiper component is added as the header of flatlist
  header = () => {
    if (this.state.swiperShow) {
      return (
        <View style={[styles.swiperContainer, this.props.style.swiperContainer]}>
          <Swiper
            autoplay
            autoplayTimeout={4}//set the autoplay time
            style={styles.swiper}
            showsButtons={false}
          >
            {/*every swiper elements contains a button which includes the inmage and text*/}
            <View style={styles.swiper}>
              <TouchableOpacity
                style={{ flex: 4 }}
                onPress={() => this.clickSwiper(0)}//press to switch to web view
              >
                <Image style={styles.ImageSwiper}
                  source={{ uri: this.state.swiperItems[0].imgSource }} />
                <Text style={[styles.textSwiper, this.props.style.textSwiper]}>
                  {this.state.swiperItems[0].text}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.swiper}>
              <TouchableOpacity
                style={{ flex: 4 }}
                onPress={() => this.clickSwiper(1)}
              >
                <Image style={styles.ImageSwiper}
                  source={{ uri: this.state.swiperItems[1].imgSource }} />
                <Text style={[styles.textSwiper, this.props.style.textSwiper]}>
                  {this.state.swiperItems[1].text}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.swiper}>
              <TouchableOpacity
                style={{ flex: 4 }}
                onPress={() => this.clickSwiper(2)}
              >
                <Image style={styles.ImageSwiper}
                  source={{ uri: this.state.swiperItems[2].imgSource }} />
                <Text style={[styles.textSwiper, this.props.style.textSwiper]}>
                  {this.state.swiperItems[2].text}
                </Text>
              </TouchableOpacity>
            </View>
          </Swiper>
        </View>
      )
    }
    else {
      //this is to avoid some conflicts with swiper and some native components
      return (
        <View style={styles.swiperContainer}>
          {/* <Text>{this.state.text}</Text> */}
          <Image source={require('../image/ic_launcher.png')} style={styles.Image2} />
        </View>
      );
    }
  }

  keyExtractor = (item, index) => index;//add key value

  render() {
    return (
      //return flatlist
      <View style={[styles.container, this.props.style.container]}>
        <FlatList
          initialNumToRender={3}
          refreshing={false}
          onRefresh={() => {
            // clear elements
            this.setState({ elements: [] });
            this.setState({ swiperShow: false });
            elementsSet = [];
            elementsTmp = [];
            swiperSet = [];
            // get them again
            this.GetElements();
          }}
          data={this.state.elements}
          ListHeaderComponent={this.header}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  swiper: {
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width,
  },
  textSwiper: {
    color: '#ddd',
    fontSize: 25,
    fontWeight: 'bold',
    position: 'absolute',
    textShadowColor: '#000',
    marginVertical: 8,
    marginHorizontal: 3,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    bottom: 0,
  },
  renderItem: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 8,
    backgroundColor: '#555555',
    borderTopColor: '#778899',
    borderBottomColor: '#778899',
    borderLeftColor: '#778899',
    borderRightColor: '#778899',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#333333',
  },
  swiperContainer: {
    height: Dimensions.get('screen').height * 0.3,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  ImageItem: {
    width: Dimensions.get('screen').width * 0.4 - 10,
    height: Dimensions.get('screen').height * 0.15,
  },
  Image2: {
    height: Dimensions.get('screen').height / 5,
    resizeMode: 'contain',
  },
  ImageSwiper: {
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width,
    resizeMode: 'cover',
    margin: 0,
  },
  txt: {
    textAlign: 'auto',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 15,
    width: Dimensions.get('screen').width * 0.6 - 16,
    height: Dimensions.get('screen').height * 0.12,
    borderColor: 'black'
  },
  txtBase: {
    color: '#888',
    fontSize: 10,
    position: 'relative',
    textAlign: 'right',
    bottom: 0,
  },
  viewBorder: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
  }
});


/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './timer/App';//不行的计时器代码
import App from './App';//俄罗斯方块的代码
//import App from './one';//简单记事本的代码
import {name as appName} from './app.json';


AppRegistry.registerComponent(appName, () => App);

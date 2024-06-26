import ActionSheet from './action-sheet';
import AddressEdit from './address-edit';
import AddressList from './address-list';
import Area from './area';
import Badge from './badge';
import Button from './button';
import Calendar from './calendar';
import Card from './card';
import Cascader from './cascader';
import Cell from './cell';
import CellGroup from './cell-group';
import Checkbox from './checkbox';
import CheckboxGroup from './checkbox-group';
import Circle from './circle';
import Col from './col';
import Collapse from './collapse';
import CollapseItem from './collapse-item';
import ContactCard from './contact-card';
import ContactEdit from './contact-edit';
import ContactList from './contact-list';
import CountDown from './count-down';
import Coupon from './coupon';
import CouponCell from './coupon-cell';
import CouponList from './coupon-list';
import DatetimePicker from './datetime-picker';
import Dialog from './dialog';
import Divider from './divider';
import DropdownItem from './dropdown-item';
import DropdownMenu from './dropdown-menu';
import Empty from './empty';
import Field from './field';
import Form from './form';
import GoodsAction from './goods-action';
import GoodsActionButton from './goods-action-button';
import GoodsActionIcon from './goods-action-icon';
import Grid from './grid';
import GridItem from './grid-item';
import Icon from './icon';
import Image from './image';
import ImagePreview from './image-preview';
import IndexAnchor from './index-anchor';
import IndexBar from './index-bar';
import Info from './info';
import Lazyload from './lazyload';
import List from './list';
import Loading from './loading';
import Locale from './locale';
import NavBar from './nav-bar';
import NoticeBar from './notice-bar';
import Notify from './notify';
import NumberKeyboard from './number-keyboard';
import Overlay from './overlay';
import Pagination from './pagination';
import Panel from './panel';
import PasswordInput from './password-input';
import Picker from './picker';
import Popover from './popover';
import Popup from './popup';
import Progress from './progress';
import PullRefresh from './pull-refresh';
import Radio from './radio';
import RadioGroup from './radio-group';
import Rate from './rate';
import Row from './row';
import Search from './search';
import ShareSheet from './share-sheet';
import Sidebar from './sidebar';
import SidebarItem from './sidebar-item';
import Skeleton from './skeleton';
import Sku from './sku';
import Slider from './slider';
import Step from './step';
import Stepper from './stepper';
import Steps from './steps';
import Sticky from './sticky';
import SubmitBar from './submit-bar';
import Swipe from './swipe';
import SwipeCell from './swipe-cell';
import SwipeItem from './swipe-item';
import Switch from './switch';
import SwitchCell from './switch-cell';
import Tab from './tab';
import Tabbar from './tabbar';
import TabbarItem from './tabbar-item';
import Tabs from './tabs';
import Tag from './tag';
import Toast from './toast';
import TreeSelect from './tree-select';
import Uploader from './uploader';
var version = '2.13.2';

function install(Vue) {
  var components = [ActionSheet, AddressEdit, AddressList, Area, Badge, Button, Calendar, Card, Cascader, Cell, CellGroup, Checkbox, CheckboxGroup, Circle, Col, Collapse, CollapseItem, ContactCard, ContactEdit, ContactList, CountDown, Coupon, CouponCell, CouponList, DatetimePicker, Dialog, Divider, DropdownItem, DropdownMenu, Empty, Field, Form, GoodsAction, GoodsActionButton, GoodsActionIcon, Grid, GridItem, Icon, Image, ImagePreview, IndexAnchor, IndexBar, Info, List, Loading, Locale, NavBar, NoticeBar, Notify, NumberKeyboard, Overlay, Pagination, Panel, PasswordInput, Picker, Popover, Popup, Progress, PullRefresh, Radio, RadioGroup, Rate, Row, Search, ShareSheet, Sidebar, SidebarItem, Skeleton, Sku, Slider, Step, Stepper, Steps, Sticky, SubmitBar, Swipe, SwipeCell, SwipeItem, Switch, SwitchCell, Tab, Tabbar, TabbarItem, Tabs, Tag, Toast, TreeSelect, Uploader];
  components.forEach(function (item) {
    if (item.install) {
      Vue.use(item);
    } else if (item.name) {
      Vue.component(item.name, item);
    }
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export { install, version, ActionSheet, AddressEdit, AddressList, Area, Badge, Button, Calendar, Card, Cascader, Cell, CellGroup, Checkbox, CheckboxGroup, Circle, Col, Collapse, CollapseItem, ContactCard, ContactEdit, ContactList, CountDown, Coupon, CouponCell, CouponList, DatetimePicker, Dialog, Divider, DropdownItem, DropdownMenu, Empty, Field, Form, GoodsAction, GoodsActionButton, GoodsActionIcon, Grid, GridItem, Icon, Image, ImagePreview, IndexAnchor, IndexBar, Info, Lazyload, List, Loading, Locale, NavBar, NoticeBar, Notify, NumberKeyboard, Overlay, Pagination, Panel, PasswordInput, Picker, Popover, Popup, Progress, PullRefresh, Radio, RadioGroup, Rate, Row, Search, ShareSheet, Sidebar, SidebarItem, Skeleton, Sku, Slider, Step, Stepper, Steps, Sticky, SubmitBar, Swipe, SwipeCell, SwipeItem, Switch, SwitchCell, Tab, Tabbar, TabbarItem, Tabs, Tag, Toast, TreeSelect, Uploader };
export default {
  install: install,
  version: version
};
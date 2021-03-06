import Vue from 'vue'
import {
    Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Radio, RadioGroup,
    RadioButton, Menu, MenuItem, MenuItemGroup, Submenu, Breadcrumb, BreadcrumbItem, Card, Col, Row, Table, TableColumn,
    Switch,Tooltip,Pagination,Dialog,MessageBox
} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
// 挂载message
Vue.prototype.$message = Message
Vue.prototype.$confirm= MessageBox.confirm
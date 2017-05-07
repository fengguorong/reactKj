import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import 'antd/dist/antd.css';

class SiderDemo extends React.Component {
    constructor(){
        super();
    }
    render() {
        return (
            <Layout>
                <Sider>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Icon type="user" />
                            <span className="nav-text"><a href="/users/me">退出登录</a></span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="upload" />
                            <span className="nav-text"><a href="/users/add" target="main">上传组件</a></span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="video-camera" />
                            <span className="nav-text"><a href="/users/adminant" target="main">官方组件</a></span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="heart-o" />
                            <span className="nav-text"><a href="/users/indexnat" target="main">开发者组件</a></span>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Icon type="team" />
                            <span className="nav-text"><a href="/users/user" target="main">查看用户</a></span>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Icon type="upload" />
                            <span className="nav-text"><a href="/" target="_blank">返回客户端</a></span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <h1>REANCT后台管理系统</h1>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '12px 0' }}>
                            <Breadcrumb.Item>React</Breadcrumb.Item>
                            <Breadcrumb.Item>Ant</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <iframe name="main" style={{ width: '100%', height: '400px' }}></iframe>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

ReactDOM.render(<SiderDemo />, root);
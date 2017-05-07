import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import 'antd/dist/antd.css';
import reqwest from 'reqwest';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

const NormalLoginForm = Form.create()(React.createClass({
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                var password=values.password;
                var username=values.userName;
                reqwest({
                    url: '/login/loginCheck',
                    method: 'post',
                    data: {
                        password,
                        username
                    }
                }).then((e) => {
                    if(e=="yes"){
                        location.href="/users";
                    }else {
                        location.href="/login";
                    }
                });
            }
        });
    },
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input addonBefore={<Icon type="user" />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}
                    <a className="login-form-forgot">Forgot password</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <a>register now!</a>
                </FormItem>
            </Form>
        );
    },
}));

ReactDOM.render(<NormalLoginForm />, root);
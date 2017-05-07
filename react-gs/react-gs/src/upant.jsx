import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import { Upload, message, Button, Icon } from 'antd';
import 'antd/dist/antd.css';
ReactDOM.render(
    <Upload>
        <Button>
            <Icon type="upload"/> Click to Upload
        </Button>
    </Upload>, root);
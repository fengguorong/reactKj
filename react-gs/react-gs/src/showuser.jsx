import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import 'antd/dist/antd.css';
class Select extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <select className="form-control" onChange={(e)=>{
            this.props.changeSex(e.target.value);
        }}>
                <option value="0" key="1">全部</option>
                <option value="1" key="2">男</option>
                <option value="2" key="3">女</option>


            </select>
        )
    }
}
class Search extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <div className="input-group">
                <span className="input-group-addon">搜索</span>
                <input type="text" className="form-control" placeholder="Username" onChange={(e)=>{
            this.props.search(e.target.value);
        }}/>
            </div>
        )
    }
}
class Table extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <table className="table table-bordered text-center">
                <tbody>
                <tr>
                    <th>用户名</th>
                    <th>手机号</th>
                    <th>性别</th>
                    <th>年龄</th>
                    <th>操作</th>
                </tr>

                {
                    this.props.stuInfo.map((a,b)=> {
                        if(a.pid!=0) {
                            return <tr key={b}>
                                <td>{a.username}</td>
                                <td>{a.tel}</td>
                                <td>{a.sex}</td>
                                <td>{a.age}</td>
                                <td onClick={()=>{
                        this.props.del(a.id);
                    }}>删除
                                </td>
                            </tr>
                        }
                    })
                }
                </tbody>
            </table>
        )
    }
}
class Main extends React.Component{
    constructor(props){
        super(props);
        this.state={stuInfo:this.props.stuInfo||[]};
        this.init=this.props.stuInfo||[];
    }
    changeSex(id){
        var map={1:"男",2:"女"}
        this.state={stuInfo:this.props.stuInfo};
        if(id=="0"){
            this.setState({stuInfo:this.init});
        }else{
            var arr=this.init.filter(function (a) {
                if(map[id]==a.sex){
                    return a;
                }
            })
            this.setState({stuInfo:arr});
        }
    }
    search(name){
        if(!name){
            this.setState({stuInfo:this.init});
            return;
        }
        var arr=this.init.filter(function (a) {
            if(name==a.username){
                return name;
            }
        })
        this.setState({stuInfo:arr});
    }
    del(id){
        var arr=this.init.filter(function (a) {
            if(a.id!=id){
                return a;
            }
        })
        this.init=arr;
        this.setState({stuInfo:arr});
    }
    componentDidMount(){
        var url=this.props.ajaxurl;
        var xmlObj=new XMLHttpRequest();
        xmlObj.onload=()=> {
            var data=JSON.parse(xmlObj.response);
            this.state={stuInfo:data};
            this.init=data;
            this.setState({stuInfo:data});
        }
        xmlObj.open("get",url);
        xmlObj.send();
    }
    render(){
        return (
            <div className="container">
                <h3>{this.props.title}</h3>
                <Select stuInfo={this.init} changeSex={this.changeSex.bind(this)}/>
                <Search search={this.search.bind(this)}/>
                <Table stuInfo={this.state.stuInfo} del={this.del.bind(this)}/>
            </div>
        )
    }
}
ReactDOM.render(<Main title="用户名单" ajaxurl="/users/userajax"/>,root);
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
                {
                    this.props.stuInfo.map((a,b)=>{
                    if(a.pid==0) {
                        return <option value={a.id} key={b}>{a.catname}</option>
                    }
                    })
                }
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
                    <th>组件名</th>
                    <th>类别</th>
                    <th>路径</th>
                    <th>下载地址</th>
                    <th>操作</th>
                </tr>

                {
                    this.props.stuInfo.map((a,b)=> {
                        if(a.pid!=0) {
                            return <tr key={b}>
                                <td>{a.catname}</td>
                                <td>{a.pid}</td>
                                <td>{a.url}</td>
                                <td>{a.zurl}</td>
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
        console.log(id);
        this.state={stuInfo:this.props.stuInfo};
        if(id=="0"){
            this.setState({stuInfo:this.init});
            console.log(1);
        }else{
            var arr=this.init.filter(function (a) {
                if(id==a.pid){
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
            if(name==a.catname){
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
ReactDOM.render(<Main title="官方组件" ajaxurl="/users/adminantajax"/>,root);
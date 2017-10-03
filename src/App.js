import React from 'react';
var request = require('superagent') ;
import localCache from './localCache';

class FriendListItem extends React.Component {
    render() {
        return (
            <li> 
                <h2>{this.props.friend.name}</h2> 
                <a href={'mailto:'+this.props.friend.email}>
                    {this.props.friend.email} </a>
            </li>
        );
    }
}

class SearchBox extends React.Component {
    onChange = (event) => {
        event.preventDefault() ;
        var newText = event.target.value.toLowerCase() ;
        this.props.handleChange(newText) ;
    };

    render() {
        return (
            <div>
                <input type="text" placeholder="Search" value={this.props.text}
                    onChange={this.onChange} />
            </div>
        );
    }
}

class FriendList extends React.Component {
    shouldComponentUpdate(nextProps, NextState) {
        if (this.props.list.length === nextProps.list.length ) {
            return false ;
        } else {
            return true ;
        }     
    }

    render() {
        var items = this.props.list.map(function(item) {
            return <FriendListItem key={item.email} friend={item} />;
        });
        return (
            <ul>
                {items}
            </ul>
        );
    }
}

class FiltetedFriends extends React.Component {
    state = {
        searchText : ''
    };

    componentDidMount() {
        request.get('http://localhost:3000/friends')
            .end(function(error, res){
                if (res) {
                    var friends = JSON.parse(res.text);
                    localCache.populate(friends);
                    this.setState({}) ; 
                } else {
                    console.log(error );
                }
            }.bind(this)); 
    }

    filterFriends = (text) => {
        this.setState({searchText : text});
    };

    render() {
        var updatedList = localCache.getAll().filter(function(item){
            return item.name.toLowerCase().search(
                this.state.searchText) !== -1 ;                
        }.bind(this) );
        return (
            <div>
                <h1>Friends List</h1>
                <SearchBox text={this.state.searchText} handleChange={this.filterFriends} />
                <FriendList list={updatedList} />
            </div>
        );
    }
}

export default FiltetedFriends;
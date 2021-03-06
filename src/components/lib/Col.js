import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import '../../assets/Col.scss';
import ComponentDropped from "./ComponentDropped";

const boxTarget = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        props.onDrop(props,monitor,component);
        fetch('/components/' + item.name + "/" + item.name + ".html",
            {
                headers: new Headers({
                    'Content-Type': 'text/html'
                })
            })
            .then(
                resp => resp.text()
            )
            .then(
                comp => {
                    component.setState(prevState => ({
                        items: [...prevState.items, {html:comp, name: item.name, id:prevState.items.length}]
                    }));
                }
            )
    },
};

@DropTarget('componentContainer', boxTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    isOverCurrent: monitor.isOver({shallow: true}),
}))

export default class Col extends Component {

    constructor(props) {
        super(props);

        this.state = {
            items: []
        }
    }

    handleMoveItem(id) {
        this.setState(
            prevState => ({
                items: [...prevState.items.filter(item => item.id !== id)]
        }))
    }

    handleDeleteItem(e, id) {
        this.setState(
            prevState => ({
                items: [...prevState.items.filter(item => item.id !== id)]
            }))
    }

    handleIsEditable(e) {
        this.setState({componentEditable: e.id, contentEditable: !e.contentEditable});
    }

    render() {
        const {
            canDrop,
            isOver,
            connectDropTarget,
        } = this.props;

        const isActive = canDrop && isOver;

        let backgroundColor = '#fff';
        if (isActive) {
            backgroundColor = '#DEF0CB';
        } else if (canDrop) {
            backgroundColor = '#F8F8F8';
        }

        const style = getStyles(this.props);

        const itemsEl = this.state.items.map(
            (content, index) => {
                return <ComponentDropped key={index}
                                         id={content.id}
                                         onMove={this.handleMoveItem.bind(this)}
                                         onDelete={this.handleDeleteItem.bind(this)}
                                         onContentEditable={this.handleIsEditable.bind(this)}
                                         contentEditable={content.id === this.state.componentEditable}
                                         name={content.name}
                                         dangerouslySetInnerHTML={{__html: content.html}}/>
            }
        );

        return connectDropTarget(
            <div className="Col" style={{...style.col, backgroundColor}}>
                {itemsEl}
            </div>
        );
    }
}

const getStyles = (props) => {
    return ({
        col: {
            flex: 1,
            marginLeft: 15,
            marginRight: 15,
            minHeight: 200,
            height: "auto"
        }
    });
};

import React, { Component, PropTypes } from 'react';
import MenuComponent from '../components/MenuComponent';

export default class MainLayout extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
    };

    render() {
        return <div>
            <header>
                <MenuComponent />
            </header>
            <div className="content">
                {this.props.children}
            </div>
        </div>;
    }
}

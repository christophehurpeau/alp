import React, { Component, PropTypes } from 'react';

export default class MenuComponent extends Component {
    static contextTypes = {
        context: PropTypes.object.isRequired,
    };

    render() {
        return <div className="menu">
            <ul>
                <li><a href={this.context.context.urlGenerator('default', { action: 'view1' })}>View 1</a></li>
                <li><a href={this.context.context.urlGenerator('default', { action: 'view2' })}>View 2</a></li>
            </ul>
        </div>;
    }
}

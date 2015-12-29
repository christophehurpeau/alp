import React, { Component, PropTypes } from 'react';
// import { production } from '../server/argv';
const production = false;

export default class Html extends Component {
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        css: PropTypes.string,
        body: PropTypes.string.isRequired,
        initialData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        title: '',
        description: '',
    };

    render() {
        return (
            <html className="no-js" lang="">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <title>{this.props.title}</title>
                <meta name="description" content={this.props.description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="apple-touch-icon" href="apple-touch-icon.png" />
                <link href="https://fonts.googleapis.com/css?family=Arvo:400,700" rel="stylesheet" type="text/css" />
                <link rel="stylesheet" href="/index.css" />
                <style id="css" dangerouslySetInnerHTML={{ __html: this.props.css }} />
                <script dangerouslySetInnerHTML={{ __html: 'window.initialData = ' + JSON.stringify(this.props.initialData) }}></script>
            </head>
            <body>
            <div id="app" dangerouslySetInnerHTML={{ __html: this.props.body }} />
            <div dangerouslySetInnerHTML={{ __html: production ? '<script defer src="/main-sfx.js"></script>' :
                `<script src="/jspm_packages/system.js"></script>
                <script src="/config.js"></script>
                <script src="/index.bundle.js"></script>
                <script>System.import('js/index.js')</script>` }}></div>
            </body>
            </html>
        );
    }
}

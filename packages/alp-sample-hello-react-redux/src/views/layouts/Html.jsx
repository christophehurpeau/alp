import React, { Component, PropTypes } from 'react';

export default class Html extends Component {
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        css: PropTypes.string,
        body: PropTypes.string.isRequired,
        initialData: PropTypes.object.isRequired,
        context: PropTypes.object.isRequired,
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
                <link href="https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic" rel="stylesheet" type="text/css" />
                <link rel="stylesheet" href="/index.css" />
                <style id="css" dangerouslySetInnerHTML={{ __html: this.props.css }} />
                <script defer src="/bundle.js"></script>
                <script dangerouslySetInnerHTML={{ __html:
                    `window.VERSION = '${this.props.context.config.get('version')}';`
                    + `window.initialData = ${JSON.stringify(this.props.initialData)}`,
                    }}
                ></script>
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{ __html: this.props.body }} />
            </body>
            </html>
        );
    }
}

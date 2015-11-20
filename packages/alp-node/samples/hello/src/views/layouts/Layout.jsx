// jscs:disable maximumLineLength
import TopLayout from 'turaco/lib/TopLayout';

export default class Layout extends TopLayout {
    head() {
        return `
    <script src="//cdn.polyfill.io/v1/polyfill.min.js?features=all"></script>

    <!--Import style -->
    <link href='http://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic' rel='stylesheet' type='text/css'>
    <link type="text/css" rel="stylesheet" href="/simple-blue.css"/>

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        `;
    }

    body($body, data) {
        const $container = $.create('div').setAttribute('class', 'container-page').appendTo($body);
        this.$content = $container;
    }
}

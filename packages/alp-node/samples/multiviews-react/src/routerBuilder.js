export default function buildRouter(builder) {
    builder
        .add('home', '/', 'site.index', {})
        .add('default', '/${action}', 'site.index', { extension: 'html' });
}

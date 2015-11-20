export default function buildRouter(builder) {
    builder
        .add('default', '/${action}?', 'site.index', { extension: 'html' });

}

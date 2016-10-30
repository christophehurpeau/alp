import { HelmetHtml } from 'fody/src';

export default ({ head, preBody, body, postBody }) => (
  <HelmetHtml head={head}>
    <div id="loading-bar" className="loading-bar"><div className="progress" /></div>
    {preBody}
    <div id="app" dangerouslySetInnerHTML={{ __html: body }} />
    {postBody}
  </HelmetHtml>
);

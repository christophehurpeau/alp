export default () => (
  <form model="User" action="/site/login">
    <fieldset legend="Login">
      <input name="email" label="Email" placeholder="Enter your email" />
      <input name="pwd" />
      <submit container-class="center" />
    </fieldset>
  </form>
);

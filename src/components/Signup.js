export const Signup = () => {
  return (
      <section>
          <h2>Signup</h2>
          <form>
            <legend>Sign Up</legend>
            <fieldset>
              <ul>
                <li>
                  <label htmlFor="email">Email</label>
                  <input type="text" id="email"/>
                </li>
                <li>
                  <label htmlFor="password">Email</label>
                  <input type="password" id="password"/>
                </li>
              </ul>
              <button type="button">Sign Up</button>
            </fieldset>
          </form>
      </section>
  );
};

export default Signup
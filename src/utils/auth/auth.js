export const isAuthenticated = () => {
    // check if the user's authentication token is present
    const authToken = localStorage.getItem("accessToken");
    // console.log("auth token from auth", authToken);
    return authToken != null;
    // Return true if user is authenticated, if not- false
  };
  
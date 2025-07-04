import { Strategy } from 'passport-local';
import { User } from "../schema/UserSchema.mjs";
import { comparePassword } from "../utils/passwordEncrypt.mjs";
import { userPassport } from '../utils/passportconfig.mjs';

export default userPassport.use('user-local',
  new Strategy({
    usernameField: "email",
    passwordField: "password"
  }, async (email, password, done) => {
    try {
      console.log("Inside user passport login");
      const findUser = await User.findOne({ email });
      if (!findUser) {
        return done(null, false, { message: "User not found, please signup" });
      }
      if (!comparePassword(password, findUser.password)) {
        return done(null, false, { message: "Bad credentials" });
      }
      return done(null, findUser);
    } catch (error) {
      return done(error);
    }
  })
);
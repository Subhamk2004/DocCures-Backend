import passport from "passport";
import { Strategy } from 'passport-local'
import { User } from "../schema/UserSchema.mjs";
import { comparePassword } from "../utils/passwordEncrypt.mjs";


passport.serializeUser((user, done) => {
    console.log('INside serializer');
    done(null, user.email);
})

passport.deserializeUser(async (email, done) => {
    console.log('Inside deserialization');

    try {
        let findUser = await User.findOne({ email });

        if (!findUser) return done(null, false, { message: "User not found, please signup" });
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }

})

export default passport.use(
    new Strategy({
      usernameField: "email",
      passwordField: "password"
    }, async (email, password, done) => {
      try {
        console.log("Inside passport login");
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
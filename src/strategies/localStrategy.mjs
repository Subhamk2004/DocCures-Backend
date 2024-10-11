import passport from "passport";
import { Strategy } from 'passport-local'
import { User } from "../schema/UserSchema.mjs";
import { comparePassword } from "../utils/passwordEncrypt.mjs";


passport.serializeUser((user, done) => {
    console.log('INside serializer');
    console.log(user.email);
    done(null, user.email);
})

passport.deserializeUser(async (email, done) => {
    console.log('Inside deserialization');

    console.log(email);
    try {
        let findUser = await User.findOne({ email });
        console.log(findUser);

        if (!findUser) throw new Error('User not found');
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

            let findUser = await User.findOne({ email });
            if (!findUser) throw new Error("User not foud please signup");
            if (!comparePassword(password, findUser.password)) throw new Error("Bad credentials");
            done(null, findUser);
        } catch (error) {
            done(`Sorry something went wrong ${error}`, null);

        }
    })
) 
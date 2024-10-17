import { Strategy } from 'passport-local';
import DoctorSchema from "../schema/DoctorSchema.mjs";
import { comparePassword } from "../utils/passwordEncrypt.mjs";
import { doctorPassport } from '../utils/passportconfig.mjs';

export default doctorPassport.use('doctor-local',
  new Strategy({
    usernameField: "email",
    passwordField: "password"
  }, async (email, password, done) => {
    try {
      console.log("Inside doctor passport login");
      const findUser = await DoctorSchema.findOne({ email });
      if (!findUser) {
        return done(null, false, { message: "Doctor not found, please signup" });
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
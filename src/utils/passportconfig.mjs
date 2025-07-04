import passport from "passport";
import { User } from "../schema/UserSchema.mjs";
import DoctorSchema from "../schema/DoctorSchema.mjs";

const userPassport = new passport.Passport();
const doctorPassport = new passport.Passport();

userPassport.serializeUser((user, done) => {
  console.log('Inside user serializer');
  done(null, { id: user._id, type: 'user' });
});

doctorPassport.serializeUser((doctor, done) => {
  console.log('Inside doctor serializer');
  done(null, { id: doctor._id, type: 'doctor' });
});

userPassport.deserializeUser(async (serializedUser, done) => {
  // console.log('Inside user deserializer', serializedUser);
  try {
    const user = await User.findById(serializedUser.id);
    if (!user) return done(null, false, { message: "User not found" });
    done(null, user);
  } catch (error) {
    console.error('User deserialization error:', error);
    done(error, null);
  }
});

doctorPassport.deserializeUser(async (serializedDoctor, done) => {
  // console.log('Inside doctor deserializer', serializedDoctor);
  try {
    const doctor = await DoctorSchema.findById(serializedDoctor.id);
    if (!doctor) return done(null, false, { message: "Doctor not found" });
    done(null, doctor);
  } catch (error) {
    console.error('Doctor deserialization error:', error);
    done(error, null);
  }
});

export { userPassport, doctorPassport };
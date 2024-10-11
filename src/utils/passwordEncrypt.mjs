import bcrypt from 'bcrypt';

let saltRounds = 10;

export const hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
}
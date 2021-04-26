const { jwt, bcrypt, logs } = require('../../lib');
const { checkUser, getUser } = require('./repo');

const getLoggedIn = async (id) => {
	try {
		let user = await getUser(id);
		return {
			code: 200,
			result: {
				status: 'success',
				data: { user },
			},
		};
	} catch (err) {
		logs.error(err.message);
		return {
			code: 500,
			result: {
				status: 'error',
				message: err.message,
			},
		};
	}
};

const passwordIsMatch = async (username, password) => {
	try {
		let user = await checkUser(username);
		const wrongUserPass = {
			code: 401,
			result: {
				status: 'error',
				message: 'incorrect username or password',
			},
		};
		if (!user) {
			return wrongUserPass;
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return wrongUserPass;
		}
		const payload = {
			user: {
				id: user.id,
				role: user.role,
			},
		};
		const token = jwt.sign(payload);
		return {
			code: 200,
			result: {
				status: 'success',
				data: {
					token: 'Bearer ' + token,
				},
				message: 'token created',
			},
		};
	} catch (err) {
		logs.error(err.message);
		return {
			code: 500,
			result: {
				status: 'error',
				message: err.message,
			},
		};
	}
};

module.exports = {
	passwordIsMatch,
	getLoggedIn,
};
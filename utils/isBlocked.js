
// verify the user blocked or not 
const isBlockedUser = (user) => {
	if (user?.isBlocked) {
		throw new Error(
			`Access Denied, ${user?.firstName} ${user?.middleName} ${user?.middleName} is blocked`
		);
	}
}
module.exports = isBlockedUser;
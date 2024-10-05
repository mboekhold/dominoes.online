export function getUserAvatar(user_profile) {
    return user_profile?.avatar_url || `https://ui-avatars.com/api/?name=${user_profile.username}&background=4b5563&color=fff`
}